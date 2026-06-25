import { AppShell, EmptyState, MatchCard } from "@/components/worldcup";
import { getMatchById } from "@/lib/worldcup";

export default async function MyPredictionsPage() {
  const match = await getMatchById("m4");
  return (
    <AppShell title="My predictions" eyebrow="Saved picks">
      {match ? <MatchCard match={match} /> : <EmptyState title="No predictions yet" body="Pick a match before kickoff to start your streak." />}
    </AppShell>
  );
}
