import Link from "next/link";
import { Building2, Menu } from "lucide-react";

const navItems = [
  ["Assistant", "/assistant"],
  ["Reports", "/reports"],
  ["Resources", "/resources"],
  ["About", "/about"]
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-civic-line bg-civic-paper/88 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3 text-civic-ink" aria-label="City Copilot home">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-civic-ink text-white shadow-[0_16px_34px_rgba(17,37,63,0.22)]">
            <Building2 aria-hidden="true" size={20} />
          </span>
          <span className="min-w-0">
            <span className="block text-base font-black tracking-[-0.03em] sm:text-lg">City Copilot</span>
            <span className="font-utility hidden text-[10px] font-bold uppercase text-civic-muted sm:block">Toronto service intelligence</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-2 text-sm font-bold text-civic-muted md:flex" aria-label="Main navigation">
          {navItems.map(([label, href]) => (
            <Link key={href} href={href} className="rounded-full px-3 py-2 transition hover:bg-white hover:text-civic-ink">
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link className="hidden rounded-full border border-civic-line bg-white px-4 py-2 text-sm font-bold text-civic-ink shadow-sm sm:inline-flex" href="/reports">
            Demo reports
          </Link>
          <Link className="rounded-full bg-civic-red px-4 py-2 text-sm font-extrabold text-white shadow-[0_12px_26px_rgba(218,41,28,0.24)] transition hover:-translate-y-0.5" href="/assistant">
            Try Copilot
          </Link>
          <button className="rounded-full border border-civic-line bg-white p-2 text-civic-ink md:hidden" aria-label="Open menu">
            <Menu size={19} aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
