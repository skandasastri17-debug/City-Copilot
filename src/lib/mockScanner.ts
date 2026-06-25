import { brickCatalog } from "../data/brickCatalog";
import { BrickInventory, MockScanInput, ScanAnalysis } from "../types";

export const cannedScans: MockScanInput[] = [
  {
    label: "Starter Tub",
    detectedBricks: {
      plate_2x4_red: 2,
      brick_2x4_blue: 1,
      wheel_small: 4,
      tile_1x2_black: 2,
    },
    confidence: 0.94,
  },
  {
    label: "Roof Pieces",
    detectedBricks: {
      brick_2x2_yellow: 4,
      slope_2x2_green: 2,
      window_1x2_clear: 1,
      plate_2x4_red: 1,
    },
    confidence: 0.9,
  },
  {
    label: "Creature Box",
    detectedBricks: {
      brick_2x2_yellow: 2,
      slope_2x2_green: 3,
      tile_1x2_black: 1,
    },
    confidence: 0.88,
  },
];

export async function analyzeMockScan(input: MockScanInput): Promise<ScanAnalysis> {
  await new Promise((resolve) => setTimeout(resolve, 700));

  return {
    detectedBricks: input.detectedBricks,
    detectedParts: Object.keys(input.detectedBricks).map((brickId) => {
      const knownBrick = brickCatalog.find((brick) => brick.id === brickId);
      return (
        knownBrick ?? {
          id: brickId,
          name: brickId,
          color: "Unknown",
          category: "Demo",
          source: "local" as const,
        }
      );
    }),
    session: {
      id: `${input.label}-${Date.now()}`,
      label: input.label,
      confidence: input.confidence,
      detectedCount: Object.values(input.detectedBricks).reduce(
        (sum, count) => sum + count,
        0
      ),
      imageUri: input.imageUri,
      source: "demo",
    },
  };
}
