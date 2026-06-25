import { AppShell, ShareCard } from "@/components/worldcup";

export default function SharePage() {
  return (
    <AppShell title="Shareable cards" eyebrow="Prediction, result, streak, rank, and personality cards">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(["daily", "result", "streak", "rank", "personality"] as const).map((variant) => <ShareCard key={variant} variant={variant} />)}
      </div>
    </AppShell>
  );
}
