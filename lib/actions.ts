"use server";

import { calculatePredictionScore, getMatchById, isPredictionLocked, predictionInputSchema, samplePredictions } from "@/lib/worldcup";

export async function savePrediction(formData: FormData): Promise<void> {
  const input = predictionInputSchema.parse({
    matchId: formData.get("matchId"),
    predictedHomeScore: formData.get("predictedHomeScore"),
    predictedAwayScore: formData.get("predictedAwayScore"),
    predictedResult: formData.get("predictedResult"),
    predictedFirstTeamToScoreId: formData.get("predictedFirstTeamToScoreId"),
    predictedTotalGoalsRange: formData.get("predictedTotalGoalsRange"),
    predictedPlayerOfMatch: formData.get("predictedPlayerOfMatch"),
    confidencePercentage: formData.get("confidencePercentage")
  });
  const match = await getMatchById(input.matchId);

  if (!match) {
    throw new Error("Match not found");
  }

  if (isPredictionLocked(match)) {
    throw new Error("Predictions are locked for this match.");
  }

  void input;
}

export async function createPrivateGroup(formData: FormData): Promise<void> {
  const name = String(formData.get("name") ?? "").trim();
  if (name.length < 3) throw new Error("Group name is too short");
}

export async function joinPrivateGroup(formData: FormData): Promise<void> {
  const inviteCode = String(formData.get("inviteCode") ?? "").trim();
  if (inviteCode.length < 4) throw new Error("Invite code is required");
}

export async function scoreMatchPredictions(matchId: string) {
  const match = await getMatchById(matchId);
  if (!match || match.status !== "completed") {
    throw new Error("Only completed matches can be scored.");
  }

  return samplePredictions
    .filter((prediction) => prediction.matchId === matchId)
    .map((prediction) => ({
      predictionId: prediction.id,
      userId: prediction.userId,
      matchId,
      ...calculatePredictionScore(prediction, match, 3),
      scoredAt: new Date().toISOString()
    }));
}

export async function createCommunityPost(_formData: FormData): Promise<void> {}
export async function saveOpportunity(_formData: FormData): Promise<void> {}
export async function signUpForShift(_formData: FormData): Promise<void> {}
export async function createOpportunity(_formData: FormData): Promise<void> {}
