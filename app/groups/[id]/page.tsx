import { AppShell, LeaderboardTable } from "@/components/worldcup";

export default async function GroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <AppShell title={`Group ${id.toUpperCase()}`} eyebrow="Member-only group leaderboard">
      <LeaderboardTable />
    </AppShell>
  );
}
