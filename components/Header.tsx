import Link from "next/link";
import { Bot, Clock3, GitCompare, HeartHandshake, Info, Map, Settings, SquarePen } from "lucide-react";

const primaryItems = [
  ["ASK", "/", SquarePen],
  ["NEIGHBORHOODS", "/neighborhoods", Map],
  ["COMPARE", "/compare", GitCompare],
  ["PARTICIPATE", "/participate", HeartHandshake],
  ["REPORTS", "/reports", Clock3],
  ["SETTINGS", "/settings", Settings],
  ["ABOUT", "/about", Info]
] as const;

export function Header() {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] flex-col border-r border-[var(--color-border)] bg-black px-3 py-4 text-[var(--color-text)] lg:flex">
        <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
          <Link href="/" className="flex items-center gap-2" aria-label="City Copilot home">
            <span className="flex h-8 w-8 items-center justify-center border border-[var(--color-accent)] text-[var(--color-accent)]">
              <Bot size={17} aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm font-bold uppercase tracking-widest text-[var(--color-accent)]">[ CITY COPILOT ]</span>
              <span className="block text-[10px] uppercase tracking-widest text-[var(--color-text-mute)]">FutureHacks civic OS</span>
            </span>
          </Link>
        </div>

        <nav className="mt-4 space-y-2" aria-label="Main navigation">
          {primaryItems.map(([label, href, Icon]) => (
            <Link
              key={`${label}-${href}`}
              href={href}
              className="group flex items-center gap-3 border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-xs font-bold uppercase tracking-widest text-[var(--color-text-dim)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              <Icon size={16} aria-hidden="true" />
              <span>[ {label} ]</span>
              <span className="ml-auto hidden text-[var(--color-accent)] group-hover:block">&gt;</span>
            </Link>
          ))}
        </nav>

        <div className="mt-4 border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent)]">[ STATUS ]</p>
          <p className="mt-2 text-xs uppercase leading-5 text-[var(--color-text-dim)]">
            ASK. EVALUATE. COMPARE. SHAPE. BUILT FOR A NO-FAIL DEMO.
          </p>
        </div>

        <div className="mt-auto border-t border-[var(--color-border)] pt-4 text-[10px] uppercase tracking-widest text-[var(--color-text-mute)]">
          <p>[ DATA ] TORONTO OPEN DATA · OSM · LOCAL FALLBACKS</p>
        </div>
      </aside>

      <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-black px-4 py-3 text-[var(--color-text)] lg:hidden">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">
            <Bot size={18} aria-hidden="true" />
            [ City Copilot ]
          </Link>
          <Link href="/neighborhoods" className="border border-[var(--color-border)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-dim)]">
            [ Neighborhoods ]
          </Link>
        </div>
      </header>
    </>
  );
}
