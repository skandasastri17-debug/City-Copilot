export function StatsGrid({ stats }: { stats: Array<{ label: string; value: string; note?: string }> }) {
  return (
    <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
          <dt className="text-sm font-medium text-stone-600">{stat.label}</dt>
          <dd className="mt-2 text-3xl font-bold text-ink">{stat.value}</dd>
          {stat.note ? <p className="mt-1 text-sm text-stone-500">{stat.note}</p> : null}
        </div>
      ))}
    </dl>
  );
}
