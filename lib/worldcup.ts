import { z } from "zod";

export type MatchStatus = "scheduled" | "live" | "completed";
export type MatchStage = "group" | "round_of_32" | "round_of_16" | "quarter_final" | "semi_final" | "final";
export type PredictionResult = "home" | "draw" | "away";
export type GoalsRange = "0-1" | "2-3" | "4+";
export type PredictionStyle = "Safe" | "Bold" | "Chaos" | "Defensive" | "Neutral";

export type Team = {
  id: string;
  name: string;
  countryCode: string;
  flagEmoji: string;
  groupLetter: string;
  fifaRankingPlaceholder: number;
};

export type Match = {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  kickoffTime: string;
  venue: string;
  city: string;
  stage: MatchStage;
  groupLetter?: string;
  status: MatchStatus;
  homeScore?: number;
  awayScore?: number;
  firstTeamToScoreId?: string;
  playerOfMatchName?: string;
};

export type Prediction = {
  id: string;
  userId: string;
  matchId: string;
  predictedHomeScore: number;
  predictedAwayScore: number;
  predictedResult: PredictionResult;
  predictedFirstTeamToScoreId: string;
  predictedTotalGoalsRange: GoalsRange;
  predictedPlayerOfMatch: string;
  confidencePercentage: number;
  lockedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type Profile = {
  id: string;
  userId: string;
  displayName: string;
  favouriteTeamId: string;
  supportedCountry: string;
  city: string;
  country: string;
  schoolOrWorkplace?: string;
  predictionStyle: PredictionStyle;
  totalPoints: number;
  accuracyPercentage: number;
  currentStreak: number;
  longestStreak: number;
};

export type LeaderboardRow = {
  rank: number;
  displayName: string;
  favouriteTeam: string;
  points: number;
  accuracy: number;
  currentStreak: number;
  predictionsMade: number;
  city: string;
  supportedCountry: string;
};

export type FootballDataProvider = {
  fetchFixtures(): Promise<Match[]>;
  fetchStandings(): Promise<LeaderboardRow[]>;
  fetchLiveScores(): Promise<Match[]>;
  fetchMatchEvents(matchId: string): Promise<Array<{ minute: number; label: string }>>;
  fetchTeams(): Promise<Team[]>;
  fetchPlayers(teamId?: string): Promise<string[]>;
};

export const teams: Team[] = [
  { id: "can", name: "Canada", countryCode: "CAN", flagEmoji: "🇨🇦", groupLetter: "A", fifaRankingPlaceholder: 31 },
  { id: "qat", name: "Qatar", countryCode: "QAT", flagEmoji: "🇶🇦", groupLetter: "A", fifaRankingPlaceholder: 58 },
  { id: "arg", name: "Argentina", countryCode: "ARG", flagEmoji: "🇦🇷", groupLetter: "B", fifaRankingPlaceholder: 1 },
  { id: "jpn", name: "Japan", countryCode: "JPN", flagEmoji: "🇯🇵", groupLetter: "B", fifaRankingPlaceholder: 18 },
  { id: "bra", name: "Brazil", countryCode: "BRA", flagEmoji: "🇧🇷", groupLetter: "C", fifaRankingPlaceholder: 5 },
  { id: "eng", name: "England", countryCode: "ENG", flagEmoji: "🏴", groupLetter: "C", fifaRankingPlaceholder: 4 },
  { id: "ind", name: "India Fans", countryCode: "IND", flagEmoji: "🇮🇳", groupLetter: "Fans", fifaRankingPlaceholder: 99 },
  { id: "usa", name: "United States", countryCode: "USA", flagEmoji: "🇺🇸", groupLetter: "D", fifaRankingPlaceholder: 13 }
];

export const matches: Match[] = [
  {
    id: "m1",
    homeTeamId: "can",
    awayTeamId: "qat",
    kickoffTime: "2026-06-16T22:00:00.000Z",
    venue: "BMO Field",
    city: "Toronto",
    stage: "group",
    groupLetter: "A",
    status: "scheduled"
  },
  {
    id: "m2",
    homeTeamId: "arg",
    awayTeamId: "jpn",
    kickoffTime: "2026-06-17T01:00:00.000Z",
    venue: "MetLife Stadium",
    city: "New York",
    stage: "group",
    groupLetter: "B",
    status: "scheduled"
  },
  {
    id: "m3",
    homeTeamId: "bra",
    awayTeamId: "eng",
    kickoffTime: "2026-06-15T19:00:00.000Z",
    venue: "SoFi Stadium",
    city: "Los Angeles",
    stage: "group",
    groupLetter: "C",
    status: "live",
    homeScore: 1,
    awayScore: 1,
    firstTeamToScoreId: "eng"
  },
  {
    id: "m4",
    homeTeamId: "usa",
    awayTeamId: "can",
    kickoffTime: "2026-06-14T20:00:00.000Z",
    venue: "BC Place",
    city: "Vancouver",
    stage: "group",
    groupLetter: "D",
    status: "completed",
    homeScore: 1,
    awayScore: 2,
    firstTeamToScoreId: "can",
    playerOfMatchName: "Alphonso Davies"
  }
];

export const playerPool = ["Alphonso Davies", "Jonathan David", "Lionel Messi", "Takefusa Kubo", "Vinicius Jr.", "Jude Bellingham"];

export const samplePredictions: Prediction[] = [
  {
    id: "p1",
    userId: "demo",
    matchId: "m4",
    predictedHomeScore: 1,
    predictedAwayScore: 2,
    predictedResult: "away",
    predictedFirstTeamToScoreId: "can",
    predictedTotalGoalsRange: "2-3",
    predictedPlayerOfMatch: "Alphonso Davies",
    confidencePercentage: 78,
    lockedAt: "2026-06-14T20:00:00.000Z",
    createdAt: "2026-06-13T14:00:00.000Z",
    updatedAt: "2026-06-13T14:00:00.000Z"
  }
];

export const demoProfile: Profile = {
  id: "profile-demo",
  userId: "demo",
  displayName: "Ved",
  favouriteTeamId: "can",
  supportedCountry: "Canada",
  city: "Mississauga",
  country: "Canada",
  schoolOrWorkplace: "Office League",
  predictionStyle: "Bold",
  totalPoints: 186,
  accuracyPercentage: 71,
  currentStreak: 4,
  longestStreak: 7
};

export const leaderboardRows: LeaderboardRow[] = [
  { rank: 1, displayName: "Maya", favouriteTeam: "Argentina", points: 214, accuracy: 76, currentStreak: 6, predictionsMade: 28, city: "Toronto", supportedCountry: "Argentina" },
  { rank: 2, displayName: "Noah", favouriteTeam: "Brazil", points: 198, accuracy: 73, currentStreak: 5, predictionsMade: 28, city: "Vancouver", supportedCountry: "Brazil" },
  { rank: 3, displayName: "Ved", favouriteTeam: "Canada", points: 186, accuracy: 71, currentStreak: 4, predictionsMade: 27, city: "Mississauga", supportedCountry: "Canada" },
  { rank: 4, displayName: "Aisha", favouriteTeam: "England", points: 171, accuracy: 68, currentStreak: 3, predictionsMade: 26, city: "London", supportedCountry: "England" },
  { rank: 5, displayName: "Rohan", favouriteTeam: "India Fans", points: 160, accuracy: 66, currentStreak: 2, predictionsMade: 25, city: "Montreal", supportedCountry: "India" }
];

export class MockFootballDataProvider implements FootballDataProvider {
  async fetchFixtures() {
    return matches;
  }

  async fetchStandings() {
    return leaderboardRows;
  }

  async fetchLiveScores() {
    return matches.filter((match) => match.status === "live");
  }

  async fetchMatchEvents(matchId: string) {
    return matchId === "m3" ? [{ minute: 19, label: "England scored first" }, { minute: 51, label: "Brazil equalized" }] : [];
  }

  async fetchTeams() {
    return teams;
  }

  async fetchPlayers() {
    return playerPool;
  }
}

export function getTeam(id: string) {
  return teams.find((team) => team.id === id) ?? teams[0];
}

export async function getMatches() {
  return new MockFootballDataProvider().fetchFixtures();
}

export async function getMatchById(id: string) {
  return (await getMatches()).find((match) => match.id === id) ?? null;
}

export async function getLiveMatches() {
  return new MockFootballDataProvider().fetchLiveScores();
}

export async function getCompletedMatches() {
  return (await getMatches()).filter((match) => match.status === "completed");
}

export async function updateMatchResult(matchId: string, result: Partial<Match>) {
  const match = await getMatchById(matchId);
  return match ? { ...match, ...result, status: "completed" as MatchStatus } : null;
}

export async function syncMatchesFromProvider(provider: FootballDataProvider = new MockFootballDataProvider()) {
  return provider.fetchFixtures();
}

export function getMatchResult(match: Match): PredictionResult | null {
  if (match.homeScore == null || match.awayScore == null) return null;
  if (match.homeScore > match.awayScore) return "home";
  if (match.homeScore < match.awayScore) return "away";
  return "draw";
}

export function getGoalsRange(totalGoals: number): GoalsRange {
  if (totalGoals <= 1) return "0-1";
  if (totalGoals <= 3) return "2-3";
  return "4+";
}

export function isPredictionLocked(match: Match, now = new Date()) {
  return now.getTime() >= new Date(match.kickoffTime).getTime();
}

export function calculatePredictionScore(prediction: Prediction, match: Match, streakBeforeMatch: number) {
  const result = getMatchResult(match);
  const resultCorrect = result === prediction.predictedResult;
  const exactCorrect = match.homeScore === prediction.predictedHomeScore && match.awayScore === prediction.predictedAwayScore;
  const totalGoals = (match.homeScore ?? 0) + (match.awayScore ?? 0);
  const nextStreak = resultCorrect ? streakBeforeMatch + 1 : 0;
  const streakBonus = nextStreak >= 10 ? 12 : nextStreak >= 5 ? 5 : nextStreak >= 3 ? 2 : 0;
  const confidencePoints = prediction.confidencePercentage >= 70 ? (resultCorrect ? 1 : -1) : 0;

  return {
    resultPoints: resultCorrect ? 3 : 0,
    exactScorePoints: exactCorrect ? 5 : 0,
    firstGoalPoints: match.firstTeamToScoreId === prediction.predictedFirstTeamToScoreId ? 2 : 0,
    totalGoalsPoints: getGoalsRange(totalGoals) === prediction.predictedTotalGoalsRange ? 2 : 0,
    playerOfMatchPoints: match.playerOfMatchName === prediction.predictedPlayerOfMatch ? 3 : 0,
    confidencePoints,
    streakBonusPoints: streakBonus,
    totalPoints: (resultCorrect ? 3 : 0) + (exactCorrect ? 5 : 0) + (match.firstTeamToScoreId === prediction.predictedFirstTeamToScoreId ? 2 : 0) + (getGoalsRange(totalGoals) === prediction.predictedTotalGoalsRange ? 2 : 0) + (match.playerOfMatchName === prediction.predictedPlayerOfMatch ? 3 : 0) + confidencePoints + streakBonus
  };
}

export function buildConfidenceSnapshot(match: Match) {
  const home = getTeam(match.homeTeamId);
  const away = getTeam(match.awayTeamId);
  return {
    match,
    homeWinPercentage: match.id === "m1" ? 64 : 42,
    drawPercentage: match.id === "m1" ? 18 : 23,
    awayWinPercentage: match.id === "m1" ? 18 : 35,
    averageHomeConfidence: match.id === "m1" ? 78 : 69,
    averageAwayConfidence: match.id === "m1" ? 61 : 73,
    totalPredictions: match.id === "m1" ? 12481 : 9304,
    label: `${home.name} vs ${away.name}`
  };
}

export function classifyPersonality(profile = demoProfile, predictions = samplePredictions) {
  const avgGoals = predictions.length
    ? predictions.reduce((sum, prediction) => sum + prediction.predictedHomeScore + prediction.predictedAwayScore, 0) / predictions.length
    : 2;
  if (avgGoals <= 2) return { title: "Defensive Coach", body: "You favour low-scoring matches and rarely trust chaos." };
  if (profile.accuracyPercentage >= 70 && profile.currentStreak >= 3) return { title: "Data Brain", body: "Your reads are measured, accurate, and usually backed by moderate confidence." };
  if (profile.predictionStyle === "Chaos") return { title: "Chaos Merchant", body: "You chase swings, upsets, and the matches everyone else is scared to call." };
  if (profile.predictionStyle === "Bold") return { title: "Bold Strategist", body: "You back clear reads with confidence and accept the bragging-rights risk." };
  return { title: "Loyal Supporter", body: "You keep your favourite side close and let heart and form share the wheel." };
}

export const predictionInputSchema = z.object({
  matchId: z.string().min(1),
  predictedHomeScore: z.coerce.number().int().min(0).max(20),
  predictedAwayScore: z.coerce.number().int().min(0).max(20),
  predictedResult: z.enum(["home", "draw", "away"]),
  predictedFirstTeamToScoreId: z.string().min(1),
  predictedTotalGoalsRange: z.enum(["0-1", "2-3", "4+"]),
  predictedPlayerOfMatch: z.string().min(2),
  confidencePercentage: z.coerce.number().int().min(0).max(100)
});
