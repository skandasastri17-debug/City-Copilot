import { notFound } from "next/navigation";
import { AppShell } from "@/components/worldcup";
import { getMatchById, getTeam, playerPool } from "@/lib/worldcup";

export default async function EditMatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const match = await getMatchById(id);
  if (!match) notFound();
  const home = getTeam(match.homeTeamId);
  const away = getTeam(match.awayTeamId);
  return (
    <AppShell title={`Edit ${home.name} vs ${away.name}`} eyebrow="Admin result editor">
      <form className="grid max-w-2xl gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold">{home.name} score<input type="number" defaultValue={match.homeScore ?? 0} className="rounded-md border border-slate-300 px-3 py-2" /></label>
          <label className="grid gap-2 text-sm font-bold">{away.name} score<input type="number" defaultValue={match.awayScore ?? 0} className="rounded-md border border-slate-300 px-3 py-2" /></label>
        </div>
        <label className="grid gap-2 text-sm font-bold">First team to score<select className="rounded-md border border-slate-300 px-3 py-2"><option>{home.name}</option><option>{away.name}</option></select></label>
        <label className="grid gap-2 text-sm font-bold">Player of the match<select className="rounded-md border border-slate-300 px-3 py-2">{playerPool.map((player) => <option key={player}>{player}</option>)}</select></label>
        <button className="rounded-md bg-emerald-600 px-4 py-3 font-black text-white">Save result placeholder</button>
      </form>
    </AppShell>
  );
}
