import { notFound } from "next/navigation";
import { AppShell, PredictionForm, PointsBreakdown } from "@/components/worldcup";
import { getMatchById, getTeam } from "@/lib/worldcup";

export default async function PredictPage({ params }: { params: Promise<{ matchId: string }> }) {
  const { matchId } = await params;
  const match = await getMatchById(matchId);
  if (!match) notFound();
  const home = getTeam(match.homeTeamId);
  const away = getTeam(match.awayTeamId);
  return (
    <AppShell title={`Predict ${home.name} vs ${away.name}`} eyebrow="Server-validated lock rules">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.75fr]">
        <PredictionForm match={match} />
        <PointsBreakdown />
      </div>
    </AppShell>
  );
}
