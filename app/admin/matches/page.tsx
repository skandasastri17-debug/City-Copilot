import Link from "next/link";
import { AppShell, MatchCard } from "@/components/worldcup";
import { getMatches } from "@/lib/worldcup";

export default async function AdminMatchesPage() {
  const matches = await getMatches();
  return (
    <AppShell title="Admin matches" eyebrow="Seeded fixture management">
      <div className="grid gap-4">
        {matches.map((match) => (
          <div key={match.id} className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-[1fr_auto]">
            <MatchCard match={match} compact />
            <Link href={`/admin/matches/${match.id}/edit`} className="self-center rounded-md bg-slate-950 px-4 py-2 text-sm font-black text-white">Edit result</Link>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
