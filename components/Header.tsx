import Link from "next/link";
import { Bot, Clock3, GitCompare, Grid2X2, HeartHandshake, Info, Map, Settings, SquarePen } from "lucide-react";

const primaryItems = [
  ["Ask", "/", SquarePen],
  ["Neighborhoods", "/neighborhoods", Map],
  ["Compare", "/compare", GitCompare],
  ["Participate", "/participate", HeartHandshake],
  ["Reports", "/reports", Clock3],
  ["Settings", "/settings", Settings],
  ["About", "/about", Info]
] as const;

export function Header() {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[280px] flex-col border-r border-white/10 bg-[#080808] px-3 py-4 text-[#ececec] lg:flex">
        <div className="mb-6 flex items-center justify-between px-3">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-[-0.02em]" aria-label="City Copilot home">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#da291c] text-white">
              <Bot size={18} aria-hidden="true" />
            </span>
            <span>
              <span className="block leading-5">City Copilot</span>
              <span className="block text-xs font-medium text-white/46">Toronto service desk</span>
            </span>
          </Link>
          <Link href="/about" className="rounded-lg p-2 text-white/70 transition hover:bg-white/10 hover:text-white" aria-label="About City Copilot">
            <Info size={19} aria-hidden="true" />
          </Link>
        </div>

        <nav className="space-y-1" aria-label="Main navigation">
          {primaryItems.map(([label, href, Icon], index) => (
            <Link
              key={`${label}-${href}`}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/82 transition hover:bg-white/10 hover:text-white ${index === 0 ? "bg-[#da291c] text-white shadow-[0_10px_28px_rgba(218,41,28,0.22)]" : ""}`}
            >
              <Icon size={19} aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 min-h-0 flex-1 overflow-hidden">
          <p className="px-3 text-sm font-bold text-white">Merged MVP</p>
          <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
            <p className="text-sm font-semibold text-white/84">Ask. Evaluate. Shape.</p>
            <p className="mt-1 text-xs leading-5 text-white/46">City Copilot now combines civic chat, livability scoring, and proposal actions.</p>
          </div>
        </div>

        <div className="mt-4 border-t border-white/10 pt-4">
          <div className="flex items-center gap-3 rounded-xl px-3 py-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#da291c] text-xs font-black text-white">CC</span>
            <span>
              <span className="block text-sm font-semibold text-white">City Copilot</span>
              <span className="block text-xs text-white/50">Toronto demo</span>
            </span>
            <Grid2X2 className="ml-auto text-white/58" size={17} aria-hidden="true" />
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050505]/94 px-4 py-3 text-white backdrop-blur lg:hidden">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <Bot size={20} aria-hidden="true" />
            City Copilot
          </Link>
          <Link href="/settings" className="rounded-full border border-white/15 px-3 py-1.5 text-sm text-white/80">
            Settings
          </Link>
        </div>
      </header>
    </>
  );
}
