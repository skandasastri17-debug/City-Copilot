import { notFound } from "next/navigation";
import { AppShell, ConfidenceIndexCard, MatchCard, PointsBreakdown, TeamBadge } from "@/components/worldcup";
import { getMatchById, getTeam } from "@/lib/worldcup";

export default async function MatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const match = await getMatchById(id);
  if (!match) notFound();
  const home = getTeam(match.homeTeamId);
  const away = getTeam(match.awayTeamId);

  return (
    <AppShell title={`${home.name} vs ${away.name}`} eyebrow="Match center">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <div className="grid gap-6">
          <MatchCard match={match} />
          <PointsBreakdown />
        </div>
        <div className="grid gap-6">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">Teams</h2>
            <div className="mt-4 flex flex-wrap gap-3"><TeamBadge teamId={home.id} /><TeamBadge teamId={away.id} /></div>
          </div>
          <ConfidenceIndexCard match={match} />
        </div>
      </div>
    </AppShell>
  );
}
