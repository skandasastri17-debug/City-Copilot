import { z } from "zod";
import { OpenAIDetectedPart } from "../types.js";

const OPENAI_API_URL = "https://api.openai.com/v1/responses";

const responseSchema = z.object({
  parts: z.array(
    z.object({
      part_num: z.string(),
      color_name: z.string(),
      quantity: z.number().int().min(0),
      confidence: z.number().min(0).max(1),
    })
  ),
  notes: z.string(),
  overall_confidence: z.number().min(0).max(1),
});

export async function analyzeLegoImage(args: {
  imageBase64: string;
  mimeType: string;
  openAiApiKey: string;
  model: string;
}): Promise<{
  parts: OpenAIDetectedPart[];
  notes: string;
  confidence: number;
}> {
  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${args.openAiApiKey}`,
    },
    body: JSON.stringify({
      model: args.model,
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text:
                "You are a LEGO part detector. Identify likely official LEGO part numbers and color names visible in the image. Only return parts you can see with reasonable confidence. Do not invent parts.",
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text:
                "Analyze this photo of LEGO pieces. Return JSON only. For each detected piece family, give the best Rebrickable-compatible part number if you can infer it, the color name, quantity, and confidence. Use a conservative approach and omit uncertain pieces.",
            },
            {
              type: "input_image",
              image_url: `data:${args.mimeType};base64,${args.imageBase64}`,
              detail: "high",
            },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "lego_scan_backend",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              parts: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    part_num: { type: "string" },
                    color_name: { type: "string" },
                    quantity: { type: "integer", minimum: 0 },
                    confidence: { type: "number", minimum: 0, maximum: 1 },
                  },
                  required: ["part_num", "color_name", "quantity", "confidence"],
                },
              },
              notes: { type: "string" },
              overall_confidence: { type: "number", minimum: 0, maximum: 1 },
            },
            required: ["parts", "notes", "overall_confidence"],
          },
        },
      },
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`OpenAI request failed: ${response.status} ${message}`);
  }

  const payload = (await response.json()) as {
    output_text?: string;
    output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
  };

  const rawText =
    payload.output_text ||
    payload.output
      ?.flatMap((item) => item.content ?? [])
      .find((item) => item.type === "output_text" && item.text)?.text;

  if (!rawText) {
    throw new Error("OpenAI response did not include structured text output.");
  }

  const parsed = responseSchema.parse(JSON.parse(rawText));
  return {
    parts: parsed.parts,
    notes: parsed.notes,
    confidence: parsed.overall_confidence,
  };
}
