import Link from "next/link";
import { AppShell, DemoScoreBreakdown, LeaderboardTable, MatchCard, StreakBadge, UserRankCard } from "@/components/worldcup";
import { demoProfile, getMatches, leaderboardRows } from "@/lib/worldcup";

export default async function DashboardPage() {
  const matches = await getMatches();
  return (
    <AppShell title={`Welcome back, ${demoProfile.displayName}`} eyebrow="Protected dashboard preview">
      <div className="grid gap-6">
        <UserRankCard />
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <StreakBadge />
          <Link href="/groups/new" className="rounded-md bg-slate-950 px-4 py-2 text-sm font-bold text-white">Invite friends</Link>
        </div>
        <section>
          <h2 className="mb-3 text-2xl font-black">Upcoming matches to predict</h2>
          <div className="grid gap-4 md:grid-cols-2">{matches.filter((match) => match.status !== "completed").map((match) => <MatchCard key={match.id} match={match} />)}</div>
        </section>
        <section className="grid gap-6 lg:grid-cols-[0.75fr_1fr]">
          <DemoScoreBreakdown />
          <div><h2 className="mb-3 text-2xl font-black">Your leaderboard neighborhood</h2><LeaderboardTable rows={leaderboardRows.slice(0, 3)} /></div>
        </section>
      </div>
    </AppShell>
  );
}
