import { clsx } from "clsx";
import type { UrgencyLevel } from "@/lib/types";

export function UrgencyBadge({ urgency }: { urgency: UrgencyLevel }) {
  const classes = {
    low: "bg-stone-100 text-stone-800",
    medium: "bg-amber-100 text-amber-950",
    high: "bg-orange-100 text-orange-950",
    critical: "bg-red-100 text-red-900"
  };

  return <span className={clsx("rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide", classes[urgency])}>{urgency}</span>;
}

export function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={clsx("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold", className ?? "bg-stone-100 text-stone-800")}>{children}</span>;
}
