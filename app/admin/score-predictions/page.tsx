import { scoreMatchPredictions } from "@/lib/actions";
import { AppShell } from "@/components/worldcup";
import { getCompletedMatches, getTeam } from "@/lib/worldcup";

async function scoreMatch(formData: FormData) {
  "use server";
  await scoreMatchPredictions(String(formData.get("matchId")));
}

export default async function ScorePredictionsPage() {
  const matches = await getCompletedMatches();
  return (
    <AppShell title="Score predictions" eyebrow="MVP scoring job">
      <div className="grid gap-4">
        {matches.map((match) => {
          const home = getTeam(match.homeTeamId);
          const away = getTeam(match.awayTeamId);
          return (
            <form key={match.id} action={scoreMatch} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <input type="hidden" name="matchId" value={match.id} />
              <div><h2 className="font-black">{home.name} {match.homeScore} - {match.awayScore} {away.name}</h2><p className="text-sm text-slate-600">Calculates points, streaks, badges, and leaderboard cache refresh.</p></div>
              <button className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-black text-white">Score match</button>
            </form>
          );
        })}
      </div>
    </AppShell>
  );
}
