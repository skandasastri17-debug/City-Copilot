import * as ImageManipulator from "expo-image-manipulator";
import { BrickInventory, DetectedPart, RealBuildMatch, ScanAnalysis } from "../types";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export async function analyzeImageWithBackend(imageUri: string): Promise<ScanAnalysis> {
  if (!API_BASE_URL) {
    throw new Error(
      "Missing EXPO_PUBLIC_API_BASE_URL. Point the app at your scan backend before running live scans."
    );
  }

  const normalizedImage = await normalizeImageForUpload(imageUri);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/api/scan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageBase64: normalizedImage.base64,
        mimeType: normalizedImage.mimeType,
        filename: normalizedImage.filename,
      }),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown network error";
    throw new Error(
      `Could not reach the scan server at ${API_BASE_URL}. Check that the backend is running and your phone is on the same network. ${message}`
    );
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Backend scan failed: ${response.status} ${errorText}`);
  }

  const payload = (await response.json()) as {
    detectedParts: Array<{
      id: string;
      name: string;
      color: string;
      category: string;
      imageUrl?: string;
      partNum?: string;
      colorId?: number;
      quantity: number;
    }>;
    realBuilds?: RealBuildMatch[];
    confidence: number;
    notes?: string;
  };

  const detectedBricks = payload.detectedParts.reduce<BrickInventory>((acc, part) => {
    if (part.quantity > 0) {
      acc[part.id] = (acc[part.id] ?? 0) + part.quantity;
    }
    return acc;
  }, {});

  const detectedParts: DetectedPart[] = payload.detectedParts.map((part) => ({
    id: part.id,
    name: part.name,
    color: part.color,
    category: part.category,
    imageUrl: part.imageUrl,
    partNum: part.partNum,
    colorId: part.colorId,
    source: "rebrickable",
    quantity: part.quantity,
  }));

  return {
    detectedBricks,
    detectedParts,
    realBuilds: payload.realBuilds ?? [],
    notes: payload.notes,
    session: {
      id: `backend-scan-${Date.now()}`,
      label: "Vision + Rebrickable Scan",
      confidence: payload.confidence,
      detectedCount: Object.values(detectedBricks).reduce((sum, count) => sum + count, 0),
      imageUri,
      source: "openai",
    },
  };
}

async function normalizeImageForUpload(imageUri: string) {
  // Always normalize to a reasonably sized JPEG so large library photos do not fail in transit.
  const manipulated = await ImageManipulator.manipulateAsync(
    imageUri,
    [{ resize: { width: 1600 } }],
    {
      compress: 0.78,
      format: ImageManipulator.SaveFormat.JPEG,
      base64: true,
    }
  );

  if (!manipulated.base64) {
    throw new Error("Image conversion failed before upload.");
  }

  return {
    base64: manipulated.base64,
    mimeType: "image/jpeg",
    filename: "scan.jpg",
  };
}

function guessMimeType(imageUri: string) {
  const normalized = imageUri.toLowerCase();

  if (normalized.endsWith(".png")) {
    return "image/png";
  }

  if (normalized.endsWith(".webp")) {
    return "image/webp";
  }

  return "image/jpeg";
}
