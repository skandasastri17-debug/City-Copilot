import { AppShell, LeaderboardTable } from "@/components/worldcup";
import { leaderboardRows } from "@/lib/worldcup";

export default function LeaderboardsPage() {
  const cityRows = leaderboardRows.filter((row) => ["Mississauga", "Toronto", "Vancouver"].includes(row.city));
  return (
    <AppShell title="Leaderboards" eyebrow="Global, country, city, team, and group ranks">
      <div className="grid gap-8">
        <section><h2 className="mb-3 text-2xl font-black">Global</h2><LeaderboardTable /></section>
        <section><h2 className="mb-3 text-2xl font-black">Country leagues</h2><LeaderboardTable rows={leaderboardRows.filter((row) => ["Canada", "Argentina", "Brazil", "India"].includes(row.supportedCountry))} /></section>
        <section><h2 className="mb-3 text-2xl font-black">City rankings</h2><LeaderboardTable rows={cityRows} /></section>
      </div>
    </AppShell>
  );
}
