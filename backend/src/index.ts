import "dotenv/config";
import cors from "cors";
import express from "express";
import { z } from "zod";
import { analyzeLegoImage } from "./lib/openai.js";
import {
  fetchRebrickableColors,
  fetchSetParts,
  fetchSetsForPartColor,
  fetchRebrickableParts,
  matchColorId,
} from "./lib/rebrickable.js";
import { scoreSetMatches } from "./lib/setMatcher.js";

const envSchema = z.object({
  OPENAI_API_KEY: z.string().min(1),
  OPENAI_MODEL: z.string().min(1).default("gpt-4.1-mini"),
  REBRICKABLE_API_KEY: z.string().min(1),
  PORT: z.coerce.number().int().positive().default(8787),
  CORS_ORIGIN: z.string().default("*"),
});

const env = envSchema.parse(process.env);

const scanRequestSchema = z.object({
  imageBase64: z.string().min(1),
  mimeType: z.string().min(1),
  filename: z.string().optional(),
});

const app = express();
app.use(cors({ origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN }));
app.use(express.json({ limit: "25mb" }));

let colorCache:
  | {
      loadedAt: number;
      colors: Awaited<ReturnType<typeof fetchRebrickableColors>>;
    }
  | undefined;

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "brickwise-scan-backend",
    timestamp: new Date().toISOString(),
  });
});

app.post("/api/scan", async (req, res) => {
  try {
    const body = scanRequestSchema.parse(req.body);
    const analysis = await analyzeLegoImage({
      imageBase64: body.imageBase64,
      mimeType: body.mimeType,
      openAiApiKey: env.OPENAI_API_KEY,
      model: env.OPENAI_MODEL,
    });

    const uniquePartNums = analysis.parts.map((part) => part.part_num).filter(Boolean);
    const [partMap, colors] = await Promise.all([
      fetchRebrickableParts(uniquePartNums, env.REBRICKABLE_API_KEY),
      getColors(env.REBRICKABLE_API_KEY),
    ]);

    const detectedParts = analysis.parts
      .map((detected) => {
        const canonicalPart = partMap.get(detected.part_num);
        const color = matchColorId(detected.color_name, colors);
        if (!canonicalPart) {
          return {
            id: color ? `${detected.part_num}_${color.id}` : `${detected.part_num}_${detected.color_name}`,
            name: `Detected Part ${detected.part_num}`,
            color: color?.name ?? detected.color_name,
            colorId: color?.id,
            category: "Detected Part",
            imageUrl: undefined,
            partNum: detected.part_num,
            quantity: detected.quantity,
            confidence: detected.confidence,
          };
        }

        return {
          id: color ? `${canonicalPart.part_num}_${color.id}` : canonicalPart.part_num,
          name: canonicalPart.name,
          color: color?.name ?? detected.color_name,
          colorId: color?.id,
          category: canonicalPart.part_cat_id
            ? `Part Category ${canonicalPart.part_cat_id}`
            : "Part",
          imageUrl: canonicalPart.part_img_url,
          partNum: canonicalPart.part_num,
          quantity: detected.quantity,
          confidence: detected.confidence,
        };
      })
      .filter((part): part is NonNullable<typeof part> => Boolean(part));

    const inventoryMap = Object.fromEntries(
      detectedParts.map((part) => [part.id, part.quantity])
    );

    const candidateSets = await Promise.all(
      detectedParts
        .filter((part) => part.partNum && part.colorId)
        .slice(0, 5)
        .map(async (part) => {
          const sets = await fetchSetsForPartColor(
            part.partNum!,
            part.colorId,
            env.REBRICKABLE_API_KEY
          );
          return sets;
        })
    );

    const setMetaMap = new Map(
      candidateSets
        .flat()
        .map((set) => [set.set_num, set] as const)
    );

    const topCandidateSetNums = Array.from(setMetaMap.keys()).slice(0, 8);
    const setPartsEntries = await Promise.all(
      topCandidateSetNums.map(async (setNum) => {
        const parts = await fetchSetParts(setNum, env.REBRICKABLE_API_KEY);
        return [setNum, parts] as const;
      })
    );

    const realBuilds = scoreSetMatches(
      inventoryMap,
      new Map(setPartsEntries),
      setMetaMap
    );

    res.json({
      detectedParts,
      realBuilds,
      confidence: analysis.confidence,
      notes: analysis.notes,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown backend error";
    res.status(400).json({ error: message });
  }
});

app.listen(env.PORT, () => {
  console.log(`Brickwise backend listening on http://localhost:${env.PORT}`);
});

async function getColors(apiKey: string) {
  const now = Date.now();
  if (colorCache && now - colorCache.loadedAt < 1000 * 60 * 60 * 24) {
    return colorCache.colors;
  }

  const colors = await fetchRebrickableColors(apiKey);
  colorCache = { loadedAt: now, colors };
  return colors;
}
