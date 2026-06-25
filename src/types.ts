export type BrickInventory = Record<string, number>;

export type BrickDefinition = {
  id: string;
  name: string;
  color: string;
  category: string;
  imageUrl?: string;
  partNum?: string;
  colorId?: number;
  source?: "local" | "rebrickable";
};

export type DetectedPart = BrickDefinition & {
  quantity: number;
};

export type BuildRecipe = {
  id: string;
  name: string;
  summary: string;
  difficulty: string;
  buildTime: string;
  theme: string;
  requirements: BrickInventory;
  steps: string[];
};

export type BuildMatch = {
  recipe: BuildRecipe;
  coverage: number;
  missingPieces: number;
};

export type RealBuildMatch = {
  id: string;
  setNum: string;
  name: string;
  year?: number;
  numParts?: number;
  setImgUrl?: string;
  setUrl?: string;
  theme?: string;
  coverage: number;
  ownedPieces: number;
  totalRequired: number;
  missingPieces: number;
};

export type ScanSession = {
  id: string;
  label: string;
  confidence: number;
  detectedCount: number;
  imageUri?: string;
  source?: "demo" | "openai";
};

export type TabId = "scan" | "builds" | "inventory";

export type MockScanInput = {
  label: string;
  detectedBricks: BrickInventory;
  confidence: number;
  imageUri?: string;
};

export type ScanAnalysis = {
  detectedBricks: BrickInventory;
  session: ScanSession;
  notes?: string;
  detectedParts?: DetectedPart[];
  realBuilds?: RealBuildMatch[];
};
