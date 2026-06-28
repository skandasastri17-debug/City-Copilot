"use client";

import Link from "next/link";
import { ArrowRight, CalendarPlus, Check, ChevronRight, Clipboard, ExternalLink, Loader2, Mail, MapPin, RotateCcw, Scale, Search, Sparkles, ThumbsDown, ThumbsUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { applyScenario, getNeighborhood, neighborhoods, proposalScore, proposals, scenarios, scoreAxes, type CivicProposal, type NeighborhoodProfile, type ScoreAxis } from "@/lib/civicPlatform";

export function NeighborhoodsWorkspace() {
  const [selectedId, setSelectedId] = useState(neighborhoods[0].id);
  const [scenarioId, setScenarioId] = useState(scenarios[0].id);
  const [address, setAddress] = useState(neighborhoods[0].addressHint);
  const [liveProfile, setLiveProfile] = useState<NeighborhoodProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const profile = liveProfile ?? getNeighborhood(selectedId);
  const projected = applyScenario(profile, scenarioId);

  async function analyzeAddress() {
    if (!address.trim()) return;
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/neighborhood-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address })
      });
      if (!response.ok) throw new Error("Could not analyze that place.");
      const report = (await response.json()) as NeighborhoodProfile;
      setLiveProfile(report);
      setMessage(report.source === "Live" ? "Live civic data connected." : "Using fallback civic profile because the live lookup was unavailable.");
    } catch {
      setMessage("The live lookup failed, so the app kept the local civic profile available.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PlatformShell eyebrow="Evaluate" title="Neighborhood intelligence" body="Search a Toronto place, read its livability signals, and test what a civic improvement would change.">
      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[28px] border border-white/10 bg-[#111] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-utility text-[11px] font-bold uppercase tracking-[0.16em] text-[#55c7d9]">Address analysis</p>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.03em]">{profile.name}</h2>
              <p className="mt-1 flex items-center gap-2 text-sm text-white/48"><MapPin size={15} aria-hidden="true" /> {profile.addressHint}</p>
            </div>
            <select value={selectedId} onChange={(event) => setSelectedId(event.target.value)} className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm font-bold text-white outline-none">
              {neighborhoods.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <input
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="Try: 100 Queen St W, Toronto"
              className="h-13 min-h-12 flex-1 rounded-2xl border border-white/10 bg-black/35 px-4 text-sm font-semibold text-white outline-none placeholder:text-white/28 focus:border-[#55c7d9]/60"
            />
            <button type="button" onClick={analyzeAddress} disabled={loading} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#da291c] px-5 text-sm font-black text-white disabled:opacity-60">
              {loading ? <Loader2 className="animate-spin" size={17} aria-hidden="true" /> : <Search size={17} aria-hidden="true" />}
              Analyze
            </button>
          </div>
          {message ? <p className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm font-bold text-white/58">{message}</p> : null}

          <div className="mt-6 grid gap-5 lg:grid-cols-[260px_1fr]">
            <ScoreDial score={projected.score} label={projected.scenario ? `+${projected.score - profile.score} from ${projected.scenario.name}` : profile.rank} />
            <div>
              <p className="rounded-2xl border border-[#55c7d9]/20 bg-[#55c7d9]/10 p-4 text-lg font-extrabold leading-8 tracking-[-0.02em]">{profile.summary}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <SignalTile label="Rank" value={profile.rank} />
                <SignalTile label="Trend" value={profile.trend} />
                <SignalTile label="Forecast" value={`${profile.forecast.at(-1)}/100`} />
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            {scoreAxes.map((axis) => (
              <ScoreBar key={axis} axis={axis} value={projected.axes[axis]} base={profile.axes[axis]} />
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-white/10 bg-[#111] p-5">
          <p className="font-utility text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">What-if simulator</p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.03em]">Test a city intervention</h2>
          <div className="mt-5 grid gap-3">
            {scenarios.map((scenario) => (
              <button key={scenario.id} type="button" onClick={() => setScenarioId(scenario.id)} className={`rounded-2xl border p-4 text-left transition ${scenarioId === scenario.id ? "border-[#da291c] bg-[#da291c]/12" : "border-white/10 bg-white/5 hover:bg-white/10"}`}>
                <span className="text-sm font-black text-white">{scenario.name}</span>
                <span className="mt-1 block text-sm leading-6 text-white/52">{scenario.description}</span>
                <span className="mt-3 inline-flex rounded-full bg-white/8 px-3 py-1 text-xs font-bold text-white/60">+{scenario.delta} {scenario.axis}</span>
              </button>
            ))}
          </div>
          <InsightList title="Signals" items={profile.signals} />
          <InsightList title="Watch list" items={profile.risks} />
          {profile.liveLeads?.length ? <LiveLeadList leads={profile.liveLeads} /> : null}
        </section>
      </div>
    </PlatformShell>
  );
}

export function CompareWorkspace() {
  const [leftId, setLeftId] = useState(neighborhoods[0].id);
  const [rightId, setRightId] = useState(neighborhoods[1].id);
  const [leftQuery, setLeftQuery] = useState(neighborhoods[0].addressHint);
  const [rightQuery, setRightQuery] = useState(neighborhoods[1].addressHint);
  const [leftLive, setLeftLive] = useState<NeighborhoodProfile | null>(null);
  const [rightLive, setRightLive] = useState<NeighborhoodProfile | null>(null);
  const [loadingSide, setLoadingSide] = useState<"left" | "right" | null>(null);
  const left = leftLive ?? getNeighborhood(leftId);
  const right = rightLive ?? getNeighborhood(rightId);
  const winner = left.score === right.score ? "Tie" : left.score > right.score ? left.name : right.name;

  async function analyzeSide(side: "left" | "right") {
    const query = side === "left" ? leftQuery : rightQuery;
    if (!query.trim()) return;
    setLoadingSide(side);
    try {
      const response = await fetch("/api/neighborhood-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: query })
      });
      if (!response.ok) throw new Error("Compare lookup failed");
      const report = (await response.json()) as NeighborhoodProfile;
      if (side === "left") setLeftLive(report);
      else setRightLive(report);
    } finally {
      setLoadingSide(null);
    }
  }

  return (
    <PlatformShell eyebrow="Compare" title="Two places, one civic read" body="Compare neighborhood strengths before choosing where to live, invest, report, or organize.">
      <div className="grid gap-5 xl:grid-cols-[1fr_360px_1fr]">
        <ComparePanel profile={left} selectedId={leftId} onSelect={(id) => { setLeftId(id); setLeftLive(null); }} query={leftQuery} onQuery={setLeftQuery} onAnalyze={() => analyzeSide("left")} loading={loadingSide === "left"} />
        <section className="rounded-[28px] border border-[#da291c]/25 bg-[#da291c]/10 p-5 text-center">
          <Scale className="mx-auto text-[#55c7d9]" size={30} aria-hidden="true" />
          <p className="mt-5 text-sm font-bold uppercase tracking-[0.14em] text-white/48">Stronger overall</p>
          <h2 className="mt-2 text-3xl font-black tracking-[-0.04em]">{winner}</h2>
          <p className="mt-4 text-sm leading-6 text-white/58">The comparison uses the same livability categories from the Neighborhood Now scoring concept.</p>
          <Link href="/assistant" className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#da291c] px-4 py-3 text-sm font-black text-white">
            Ask Copilot why <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </section>
        <ComparePanel profile={right} selectedId={rightId} onSelect={(id) => { setRightId(id); setRightLive(null); }} query={rightQuery} onQuery={setRightQuery} onAnalyze={() => analyzeSide("right")} loading={loadingSide === "right"} />
      </div>
    </PlatformShell>
  );
}

export function ParticipateWorkspace() {
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [detail, setDetail] = useState<CivicProposal | null>(null);
  const [cards, setCards] = useState<CivicProposal[]>(proposals);
  const [source, setSource] = useState("Demo fallback");
  const [loading, setLoading] = useState(false);
  const current = cards[index] ?? null;

  useEffect(() => {
    void refreshCards();
  }, []);

  async function refreshCards() {
    setLoading(true);
    try {
      const response = await fetch("/api/proposals?q=Toronto council agenda planning transit parks housing");
      if (!response.ok) throw new Error("Proposal lookup failed");
      const payload = (await response.json()) as { proposals: CivicProposal[]; source: string };
      setCards(payload.proposals.length ? payload.proposals : proposals);
      setSource(payload.source);
      setIndex(0);
    } catch {
      setCards(proposals);
      setSource("Demo fallback");
    } finally {
      setLoading(false);
    }
  }

  function move(decision: "acted" | "skipped") {
    if (!current) return;
    setHistory((items) => [`${decision === "acted" ? "Acted on" : "Skipped"}: ${current.title}`, ...items].slice(0, 6));
    setIndex((value) => value + 1);
  }

  function reset() {
    setIndex(0);
    setHistory([]);
    setDetail(null);
  }

  return (
    <PlatformShell eyebrow="Participate" title="Shape what happens next" body="Review civic proposals as clear action cards. Act on the ones that match the neighborhood future you want.">
      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <section className="flex min-h-[620px] items-center justify-center rounded-[28px] border border-white/10 bg-[#111] p-5">
          {loading ? (
            <div className="text-center">
              <Loader2 className="mx-auto animate-spin text-[#55c7d9]" size={42} aria-hidden="true" />
              <p className="mt-4 text-sm font-bold text-white/58">Loading civic cards from Toronto Open Data...</p>
            </div>
          ) : current ? (
            <ProposalCard proposal={current} onAct={() => move("acted")} onSkip={() => move("skipped")} onDetail={() => setDetail(current)} />
          ) : (
            <div className="text-center">
              <Check className="mx-auto text-[#55c7d9]" size={42} aria-hidden="true" />
              <h2 className="mt-4 text-3xl font-black tracking-[-0.04em]">All caught up</h2>
              <p className="mt-2 text-sm text-white/54">You reviewed every civic card in this demo deck.</p>
              <button type="button" onClick={reset} className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#da291c] px-4 py-3 text-sm font-black">
                <RotateCcw size={17} aria-hidden="true" /> Review again
              </button>
            </div>
          )}
        </section>

        <aside className="space-y-4">
          <div className="rounded-[28px] border border-white/10 bg-[#111] p-5">
            <p className="font-utility text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">Deck progress</p>
            <h2 className="mt-2 text-4xl font-black tracking-[-0.05em]">{Math.min(index, cards.length)}/{cards.length}</h2>
            <p className="mt-1 text-sm font-bold text-white/42">{source}</p>
            <div className="mt-4 h-2 rounded-full bg-white/10">
              <div className="h-2 rounded-full bg-[#da291c]" style={{ width: `${(Math.min(index, cards.length) / cards.length) * 100}%` }} />
            </div>
            <button type="button" onClick={refreshCards} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-black text-white/74">
              <RotateCcw size={17} aria-hidden="true" /> Refresh live cards
            </button>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-[#111] p-5">
            <h2 className="text-lg font-black tracking-[-0.02em]">Recent choices</h2>
            <div className="mt-4 space-y-2">
              {history.length ? history.map((item) => <p key={item} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-white/62">{item}</p>) : <p className="text-sm leading-6 text-white/46">No card decisions yet.</p>}
            </div>
          </div>
        </aside>
      </div>

      {detail ? <ProposalModal proposal={detail} onClose={() => setDetail(null)} /> : null}
    </PlatformShell>
  );
}

function PlatformShell({ eyebrow, title, body, children }: { eyebrow: string; title: string; body: string; children: React.ReactNode }) {
  return (
    <main className="toronto-chat-canvas min-h-[calc(100vh-57px)] bg-black px-4 py-8 text-white lg:min-h-screen lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-utility text-[11px] font-bold uppercase tracking-[0.18em] text-[#55c7d9]">{eyebrow}</p>
            <h1 className="mt-2 text-4xl font-black tracking-[-0.04em] sm:text-5xl">{title}</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-white/56">{body}</p>
          </div>
          <Link href="/" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-black text-white/76 transition hover:bg-white/10">
            <Sparkles size={17} aria-hidden="true" /> Open Copilot
          </Link>
        </header>
        {children}
      </div>
    </main>
  );
}

function ScoreDial({ score, label }: { score: number; label: string }) {
  return (
    <div className="flex aspect-square flex-col items-center justify-center rounded-[28px] border border-white/10 bg-black/30" style={{ background: `conic-gradient(#da291c ${score * 3.6}deg, rgba(255,255,255,0.08) 0deg)` }}>
      <div className="flex h-[74%] w-[74%] flex-col items-center justify-center rounded-full bg-[#111]">
        <span className="text-6xl font-black tracking-[-0.08em]">{score}</span>
        <span className="mt-2 max-w-[150px] text-center text-xs font-bold uppercase leading-5 text-white/46">{label}</span>
      </div>
    </div>
  );
}

function SignalTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/38">{label}</p>
      <p className="mt-2 text-lg font-black">{value}</p>
    </div>
  );
}

function ScoreBar({ axis, value, base }: { axis: ScoreAxis; value: number; base?: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-bold text-white/78">{axis}</span>
        <span className="font-utility text-white/46">{value}/100{base && value !== base ? ` (+${value - base})` : ""}</span>
      </div>
      <div className="mt-2 h-3 rounded-full bg-white/8">
        <div className="h-3 rounded-full bg-[#55c7d9]" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function InsightList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-5">
      <h3 className="text-sm font-black uppercase tracking-[0.12em] text-white/46">{title}</h3>
      <div className="mt-3 space-y-2">
        {items.map((item) => <p key={item} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm leading-6 text-white/62">{item}</p>)}
      </div>
    </div>
  );
}

function ComparePanel({
  profile,
  selectedId,
  onSelect,
  query,
  onQuery,
  onAnalyze,
  loading
}: {
  profile: NeighborhoodProfile;
  selectedId: string;
  onSelect: (id: string) => void;
  query: string;
  onQuery: (value: string) => void;
  onAnalyze: () => void;
  loading: boolean;
}) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-[#111] p-5">
      <select value={selectedId} onChange={(event) => onSelect(event.target.value)} className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm font-bold text-white outline-none">
        {neighborhoods.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
      </select>
      <div className="mt-3 flex gap-2">
        <input value={query} onChange={(event) => onQuery(event.target.value)} className="h-12 min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/35 px-4 text-sm font-semibold text-white outline-none placeholder:text-white/28" placeholder="Search an address" />
        <button type="button" onClick={onAnalyze} disabled={loading} className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#da291c] text-white disabled:opacity-60" aria-label="Analyze place">
          {loading ? <Loader2 className="animate-spin" size={17} aria-hidden="true" /> : <Search size={17} aria-hidden="true" />}
        </button>
      </div>
      <ScoreDial score={profile.score} label={profile.rank} />
      <p className="mt-5 text-sm leading-6 text-white/58">{profile.summary}</p>
      <div className="mt-5 space-y-3">
        {scoreAxes.map((axis) => <ScoreBar key={axis} axis={axis} value={profile.axes[axis]} />)}
      </div>
    </section>
  );
}

function LiveLeadList({ leads }: { leads: NonNullable<NeighborhoodProfile["liveLeads"]> }) {
  return (
    <div className="mt-5">
      <h3 className="text-sm font-black uppercase tracking-[0.12em] text-white/46">Live sources</h3>
      <div className="mt-3 space-y-2">
        {leads.map((lead) => (
          <a key={lead.title} href={lead.url} target="_blank" rel="noreferrer" className="block rounded-2xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10">
            <span className="text-xs font-black uppercase tracking-[0.12em] text-[#55c7d9]">{lead.source}</span>
            <span className="mt-1 block text-sm font-bold text-white/78">{lead.title}</span>
            <span className="mt-1 block text-sm leading-6 text-white/48">{lead.description}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function ProposalCard({ proposal, onAct, onSkip, onDetail }: { proposal: CivicProposal; onAct: () => void; onSkip: () => void; onDetail: () => void }) {
  return (
    <article className="w-full max-w-xl rounded-[32px] border border-white/12 bg-[#171717] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.42)]">
      <div className="flex items-start justify-between gap-4">
        <span className="rounded-full bg-[#55c7d9]/12 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#55c7d9]">{proposal.category}</span>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-white/48">+{proposalScore(proposal)} civic impact</span>
      </div>
      <h2 className="mt-6 text-4xl font-black leading-[0.98] tracking-[-0.05em]">{proposal.title}</h2>
      <p className="mt-3 flex items-center gap-2 text-sm font-bold text-white/48"><MapPin size={15} aria-hidden="true" /> {proposal.area}</p>
      <p className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-base font-semibold leading-7 text-white/72">{proposal.summary}</p>
      <p className="mt-4 text-sm leading-6 text-white/52">{proposal.civicAction}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <ProposalButton onClick={onSkip} icon={ThumbsDown}>Skip</ProposalButton>
        <ProposalButton onClick={onDetail} icon={ChevronRight}>Details</ProposalButton>
        <ProposalButton onClick={onAct} icon={ThumbsUp} primary>Act</ProposalButton>
      </div>
    </article>
  );
}

function ProposalButton({ children, icon: Icon, onClick, primary = false }: { children: React.ReactNode; icon: React.ElementType; onClick: () => void; primary?: boolean }) {
  return (
    <button type="button" onClick={onClick} className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-black transition ${primary ? "border-[#da291c] bg-[#da291c] text-white" : "border-white/10 bg-white/5 text-white/72 hover:bg-white/10"}`}>
      <Icon size={17} aria-hidden="true" />
      {children}
    </button>
  );
}

function ProposalModal({ proposal, onClose }: { proposal: CivicProposal; onClose: () => void }) {
  const mailto = `mailto:?subject=${encodeURIComponent(proposal.title)}&body=${encodeURIComponent(proposal.emailTemplate)}`;

  function addCalendar() {
    const start = new Date(`${proposal.meetingDate}T18:00:00`);
    const end = new Date(start.getTime() + 90 * 60 * 1000);
    const fmt = (date: Date) => date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//City Copilot//EN", "BEGIN:VEVENT", `DTSTART:${fmt(start)}`, `DTEND:${fmt(end)}`, `SUMMARY:${proposal.title}`, `DESCRIPTION:${proposal.summary}\\n\\n${proposal.civicAction}`, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${proposal.id}.ics`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function copyTemplate() {
    await navigator.clipboard.writeText(proposal.emailTemplate);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/78 p-4 backdrop-blur">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-[28px] border border-white/10 bg-[#111] p-5 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#55c7d9]">{proposal.category}</p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.04em]">{proposal.title}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-white/10 px-3 py-1 text-sm font-bold text-white/64">Close</button>
        </div>
        <p className="mt-4 text-sm leading-6 text-white/58">{proposal.summary}</p>
        <textarea readOnly value={proposal.emailTemplate} rows={7} className="mt-5 w-full rounded-2xl border border-white/10 bg-black/35 p-4 text-sm leading-6 text-white/72 outline-none" />
        <div className="mt-5 flex flex-wrap gap-3">
          <a href={mailto} className="inline-flex items-center gap-2 rounded-2xl bg-[#da291c] px-4 py-3 text-sm font-black"><Mail size={17} aria-hidden="true" /> Send email</a>
          <button type="button" onClick={addCalendar} className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-black text-white/74"><CalendarPlus size={17} aria-hidden="true" /> Add calendar</button>
          <button type="button" onClick={copyTemplate} className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-black text-white/74"><Clipboard size={17} aria-hidden="true" /> Copy note</button>
          <a href={proposal.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-black text-white/74"><ExternalLink size={17} aria-hidden="true" /> View source</a>
        </div>
      </div>
    </div>
  );
}
