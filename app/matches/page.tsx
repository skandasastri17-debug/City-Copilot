import { AppShell, MatchCard } from "@/components/worldcup";
import { getMatches } from "@/lib/worldcup";

export default async function MatchesPage() {
  const matches = await getMatches();
  return (
    <AppShell title="Matches" eyebrow="Predict before kickoff">
      <div className="grid gap-4 md:grid-cols-2">
        {matches.map((match) => <MatchCard key={match.id} match={match} />)}
      </div>
    </AppShell>
  );
}
