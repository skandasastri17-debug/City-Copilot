import Link from "next/link";
import { AppShell } from "@/components/worldcup";

export default function AdminPage() {
  return (
    <AppShell title="Admin tools" eyebrow="Dev operations">
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/admin/matches" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm hover:border-emerald-400">
          <h2 className="text-xl font-black">Manage matches</h2>
          <p className="mt-2 text-sm text-slate-600">Review seeded fixtures and prepare result updates.</p>
        </Link>
        <Link href="/admin/score-predictions" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm hover:border-emerald-400">
          <h2 className="text-xl font-black">Score predictions</h2>
          <p className="mt-2 text-sm text-slate-600">Run the MVP scoring job for completed matches.</p>
        </Link>
        <Link href="/confidence" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm hover:border-emerald-400">
          <h2 className="text-xl font-black">Confidence snapshots</h2>
          <p className="mt-2 text-sm text-slate-600">Inspect aggregate prediction confidence.</p>
        </Link>
      </div>
    </AppShell>
  );
}
