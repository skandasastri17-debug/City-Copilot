import { AppShell, ConfidenceIndexCard } from "@/components/worldcup";
import { getMatches } from "@/lib/worldcup";

export default async function ConfidencePage() {
  const matches = await getMatches();
  return (
    <AppShell title="Fan Confidence Index" eyebrow="Crowd reads without odds or wagering">
      <div className="grid gap-4 md:grid-cols-2">
        {matches.map((match) => <ConfidenceIndexCard key={match.id} match={match} />)}
      </div>
    </AppShell>
  );
}
