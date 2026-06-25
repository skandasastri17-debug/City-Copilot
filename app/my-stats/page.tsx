import { AppShell, UserRankCard } from "@/components/worldcup";
import { classifyPersonality } from "@/lib/worldcup";

export default function MyStatsPage() {
  const insight = classifyPersonality();
  return (
    <AppShell title="My stats" eyebrow="Accuracy, streaks, and personality">
      <div className="grid gap-6">
        <UserRankCard />
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black">{insight.title}</h2>
          <p className="mt-2 text-slate-700">{insight.body}</p>
        </div>
      </div>
    </AppShell>
  );
}
