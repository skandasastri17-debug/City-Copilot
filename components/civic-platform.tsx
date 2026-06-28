"use client";

import Link from "next/link";
import { CalendarPlus, Check, Clipboard, ExternalLink, Loader2, Mail, RotateCcw, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  applyScenarios,
  dnaAxes,
  getNeighborhood,
  neighborhoods,
  proposalScore,
  proposals,
  scenarios,
  type CivicProposal,
  type NeighborhoodProfile,
  type ScoreAxis
} from "@/lib/civicPlatform";

const radarSize = 280;
const radarCenter = radarSize / 2;
const radarRadius = radarSize / 2 - 36;

export function NeighborhoodsWorkspace() {
  const [selectedId, setSelectedId] = useState(neighborhoods[0].id);
  const [address, setAddress] = useState(neighborhoods[0].addressHint);
  const [liveProfile, setLiveProfile] = useState<NeighborhoodProfile | null>(null);
  const [activeScenarios, setActiveScenarios] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"LIVE" | "FETCHING" | "FALLBACK">("LIVE");
  const profile = liveProfile ?? getNeighborhood(selectedId);
  const projected = applyScenarios(profile, activeScenarios);

  async function analyzeAddress() {
    if (!address.trim()) return;
    setLoading(true);
    setStatus("FETCHING");
    try {
      const response = await fetch("/api/neighborhood-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address })
      });
      if (!response.ok) throw new Error("Lookup failed");
      const report = (await response.json()) as NeighborhoodProfile;
      setLiveProfile(report);
      setStatus(report.source === "Live" ? "LIVE" : "FALLBACK");
    } catch {
      setStatus("FALLBACK");
    } finally {
      setLoading(false);
    }
  }

  function toggleScenario(id: string) {
    setActiveScenarios((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  return (
    <TerminalShell>
      <StatusBar status={status} address={profile.addressHint} score={projected.score} />
      <header className="terminal-panel p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="terminal-label">[ NEIGHBORHOOD NOW // CITY COPILOT ]</p>
            <h1 className="mt-2 text-2xl font-bold uppercase tracking-tight text-[var(--color-text)]">
              <span className="text-[var(--color-accent)]">{profile.name}</span> INTELLIGENCE
            </h1>
            <p className="mt-2 max-w-3xl text-xs uppercase leading-6 tracking-wider text-[var(--color-text-dim)]">&gt; TYPE AN ADDRESS. SEE WHAT IS HAPPENING. KNOW WHERE IT IS GOING.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <select value={selectedId} onChange={(event) => { setSelectedId(event.target.value); setLiveProfile(null); }} className="border border-[var(--color-border)] bg-black px-3 py-2 text-xs font-bold uppercase tracking-widest text-[var(--color-text)]">
              {neighborhoods.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
            <input value={address} onChange={(event) => setAddress(event.target.value)} placeholder="100 Queen St W" className="min-w-0 border border-[var(--color-border)] bg-black px-3 py-2 text-xs uppercase tracking-wider text-[var(--color-text)] placeholder:text-[var(--color-text-mute)]" />
            <button type="button" onClick={analyzeAddress} disabled={loading} className="inline-flex items-center justify-center gap-2 border border-[var(--color-accent)] bg-[var(--color-accent)] px-4 py-2 text-xs font-bold uppercase tracking-widest text-black disabled:opacity-60">
              {loading ? <Loader2 className="animate-spin" size={14} aria-hidden="true" /> : <Search size={14} aria-hidden="true" />}
              [ ANALYZE ]
            </button>
          </div>
        </div>
      </header>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <div className="flex flex-col gap-4">
          <VerdictPills verdicts={profile.verdicts} />
          <ScoreReport profile={profile} score={projected.score} delta={projected.delta} dna={projected.dna} />
          <ScoreRadar base={profile.dna} modified={activeScenarios.length ? projected.dna : null} />
          <CountsPanel profile={profile} />
        </div>
        <div className="flex flex-col gap-4">
          <AnomalyPanel profile={profile} />
          <ForecastPanel profile={profile} />
          <WhatIfPanel active={activeScenarios} onToggle={toggleScenario} profile={profile} />
          <NeighborhoodChat profile={profile} />
          <LiveSources profile={profile} />
        </div>
      </div>
    </TerminalShell>
  );
}

export function CompareWorkspace() {
  const [leftId, setLeftId] = useState(neighborhoods[0].id);
  const [rightId, setRightId] = useState(neighborhoods[1].id);
  const left = getNeighborhood(leftId);
  const right = getNeighborhood(rightId);
  const winner = left.score === right.score ? "TIE" : left.score > right.score ? left.name : right.name;

  return (
    <TerminalShell>
      <PageHeader label="[ COMPARE // SIDE-BY-SIDE ]" title="Neighborhood comparison" body="Pick two Toronto places and compare score, radar DNA, verdicts, and risks." />
      <div className="grid gap-4 xl:grid-cols-[1fr_280px_1fr]">
        <ComparePanel profile={left} selectedId={leftId} onSelect={setLeftId} />
        <section className="terminal-panel p-4 text-center">
          <p className="terminal-label">[ RESULT ]</p>
          <h2 className="mt-4 text-2xl font-bold uppercase text-[var(--color-accent)]">{winner}</h2>
          <p className="mt-4 text-xs uppercase leading-6 tracking-wider text-[var(--color-text-dim)]">Strongest overall livability score from the current civic intelligence model.</p>
          <Link href="/assistant" className="mt-6 inline-flex border border-[var(--color-accent)] px-4 py-2 text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">[ ASK WHY ]</Link>
        </section>
        <ComparePanel profile={right} selectedId={rightId} onSelect={setRightId} />
      </div>
    </TerminalShell>
  );
}

export function ParticipateWorkspace() {
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [detail, setDetail] = useState<CivicProposal | null>(null);
  const [cards, setCards] = useState<CivicProposal[]>(proposals);
  const [source, setSource] = useState("FALLBACK");
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
      setSource(payload.source.toUpperCase());
      setIndex(0);
    } catch {
      setCards(proposals);
      setSource("FALLBACK");
    } finally {
      setLoading(false);
    }
  }

  function move(decision: "ACT" | "SKIP") {
    if (!current) return;
    setHistory((items) => [`[ ${decision} ] ${current.title}`, ...items].slice(0, 7));
    setIndex((value) => value + 1);
  }

  return (
    <TerminalShell>
      <PageHeader label="[ PARTICIPATE // CIVICMATCH ]" title="Shape what happens next" body="Review civic proposals, act on the ones that matter, and keep a decision trail." />
      <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <section className="terminal-panel flex min-h-[600px] items-center justify-center p-4">
          {loading ? (
            <p className="terminal-label">[ LOADING CIVIC CARDS<span className="cursor-blink">_</span> ]</p>
          ) : current ? (
            <ProposalCard proposal={current} onAct={() => move("ACT")} onSkip={() => move("SKIP")} onDetail={() => setDetail(current)} />
          ) : (
            <div className="text-center">
              <Check className="mx-auto text-[var(--color-accent)]" size={36} aria-hidden="true" />
              <h2 className="mt-4 text-xl font-bold uppercase">[ ALL CAUGHT UP ]</h2>
              <button type="button" onClick={() => { setIndex(0); setHistory([]); }} className="mt-5 border border-[var(--color-accent)] px-4 py-2 text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">[ REVIEW AGAIN ]</button>
            </div>
          )}
        </section>
        <aside className="space-y-4">
          <section className="terminal-panel p-4">
            <p className="terminal-label">[ DECK STATUS ]</p>
            <p className="mt-3 text-4xl font-bold tabular-nums text-[var(--color-accent)]">{Math.min(index, cards.length)}/{cards.length}</p>
            <p className="mt-1 text-[10px] uppercase tracking-widest text-[var(--color-text-mute)]">SOURCE: {source}</p>
            <button type="button" onClick={refreshCards} className="mt-4 inline-flex w-full items-center justify-center gap-2 border border-[var(--color-border-strong)] px-3 py-2 text-xs font-bold uppercase tracking-widest text-[var(--color-text-dim)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]">
              <RotateCcw size={14} aria-hidden="true" /> [ REFRESH ]
            </button>
          </section>
          <section className="terminal-panel p-4">
            <p className="terminal-label">[ DECISION TRAIL ]</p>
            <div className="mt-3 space-y-2">
              {history.length ? history.map((item) => <p key={item} className="border border-[var(--color-border)] bg-black p-2 text-xs uppercase leading-5 text-[var(--color-text-dim)]">{item}</p>) : <p className="text-xs uppercase tracking-wider text-[var(--color-text-mute)]">NO DECISIONS YET.</p>}
            </div>
          </section>
        </aside>
      </div>
      {detail ? <ProposalModal proposal={detail} onClose={() => setDetail(null)} /> : null}
    </TerminalShell>
  );
}

function TerminalShell({ children }: { children: React.ReactNode }) {
  return <main className="min-h-[calc(100vh-57px)] bg-black px-4 py-4 text-[var(--color-text)] lg:min-h-screen lg:px-6">{children}</main>;
}

function PageHeader({ label, title, body }: { label: string; title: string; body: string }) {
  return (
    <header className="terminal-panel mb-4 p-4">
      <p className="terminal-label">{label}</p>
      <h1 className="mt-2 text-2xl font-bold uppercase tracking-tight text-[var(--color-text)]">{title}</h1>
      <p className="mt-2 max-w-3xl text-xs uppercase leading-6 tracking-wider text-[var(--color-text-dim)]">&gt; {body}</p>
    </header>
  );
}

function StatusBar({ status, address, score }: { status: string; address: string; score: number }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3 border border-[var(--color-border)] bg-black px-3 py-2 text-[10px] uppercase tracking-widest text-[var(--color-text-mute)]">
      <span><span className={status === "LIVE" ? "text-[var(--color-accent)]" : status === "FETCHING" ? "text-[var(--color-warn)]" : "text-[var(--color-bad)]"}>[ {status} ]</span> CITY COPILOT</span>
      <span className="hidden truncate md:block">ADDR: <span className="text-[var(--color-text)]">{address}</span></span>
      <span>SCORE: <span className="text-[var(--color-accent)]">{score}</span>/100</span>
    </div>
  );
}

function VerdictPills({ verdicts }: { verdicts: string[] }) {
  return (
    <section className="flex flex-wrap gap-2">
      {verdicts.map((verdict) => <span key={verdict} className="border border-[var(--color-accent)] bg-[#041310] px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent)]">[ {verdict} ]</span>)}
    </section>
  );
}

function ScoreReport({ profile, score, delta, dna }: { profile: NeighborhoodProfile; score: number; delta: number; dna: Record<ScoreAxis, number> }) {
  return (
    <section className="terminal-panel p-4">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2">
        <p className="terminal-label">[ LIVABILITY SCORE ]</p>
        <p className="text-[10px] uppercase tracking-widest text-[var(--color-text-mute)]">CITY_AVG 72 · RANK {profile.rank}</p>
      </div>
      <div className="mt-4 flex items-baseline gap-3">
        <span className="text-6xl font-bold leading-none text-[var(--color-accent)] tabular-nums">{score}</span>
        <span className="text-sm text-[var(--color-text-mute)]">/100</span>
        {delta ? <span className={delta > 0 ? "text-[var(--color-accent)]" : "text-[var(--color-bad)]"}>{delta > 0 ? `+${delta}` : delta} PTS</span> : null}
      </div>
      <p className="mt-4 text-xs uppercase leading-6 tracking-wider text-[var(--color-text-dim)]">{profile.summary}</p>
      <div className="mt-4 space-y-2">
        {dnaAxes.map((axis) => <MetricBar key={axis} label={axis} value={dna[axis]} base={profile.dna[axis]} />)}
      </div>
    </section>
  );
}

function MetricBar({ label, value, base }: { label: string; value: number; base?: number }) {
  return (
    <div>
      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
        <span className="text-[var(--color-text-dim)]">{label}</span>
        <span className="text-[var(--color-text)]">{value}/100{base !== undefined && base !== value ? ` (${value > base ? "+" : ""}${value - base})` : ""}</span>
      </div>
      <div className="mt-1 h-2 bg-[var(--color-surface-3)]">
        <div className="h-2 bg-[var(--color-accent)]" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function ScoreRadar({ base, modified }: { base: Record<ScoreAxis, number>; modified: Record<ScoreAxis, number> | null }) {
  const baseValues = dnaAxes.map((axis) => base[axis]);
  const modifiedValues = modified ? dnaAxes.map((axis) => modified[axis]) : null;

  return (
    <section className="terminal-panel p-4">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2">
        <p className="terminal-label">[ NEIGHBORHOOD DNA // 9-AXIS FINGERPRINT ]</p>
        <p className="text-[10px] uppercase tracking-widest text-[var(--color-text-mute)]">{modified ? "TEAL = NOW · AMBER = WHAT-IF" : "PERCENTILE 0-100"}</p>
      </div>
      <div className="flex justify-center">
        <svg viewBox={`0 0 ${radarSize} ${radarSize}`} width="100%" style={{ maxWidth: 340 }} role="img" aria-label="Nine axis livability radar">
          {[0.25, 0.5, 0.75, 1].map((ring) => <circle key={ring} cx={radarCenter} cy={radarCenter} r={radarRadius * ring} fill="none" stroke="#1f1f1f" strokeDasharray={ring === 1 ? "0" : "2 3"} />)}
          {dnaAxes.map((axis, index) => {
            const p = pointFor(100, index);
            const label = labelFor(index);
            return (
              <g key={axis}>
                <line x1={radarCenter} y1={radarCenter} x2={p.x} y2={p.y} stroke="#1f1f1f" />
                <text x={label.x} y={label.y} textAnchor="middle" alignmentBaseline="middle" fontSize="9" fill="#8a8a8a">{axis.slice(0, 3).toUpperCase()}</text>
              </g>
            );
          })}
          {modifiedValues ? <path d={pathFor(modifiedValues)} fill="#fbbf24" fillOpacity="0.12" stroke="#fbbf24" strokeWidth="1.2" strokeDasharray="3 2" /> : null}
          <path d={pathFor(baseValues)} fill="#5eead4" fillOpacity="0.18" stroke="#5eead4" strokeWidth="1.5" />
          {baseValues.map((value, index) => {
            const p = pointFor(value, index);
            return <circle key={dnaAxes[index]} cx={p.x} cy={p.y} r="3" fill="#5eead4" stroke="#000" />;
          })}
        </svg>
      </div>
      <p className="border-t border-[var(--color-border)] pt-2 text-[10px] uppercase tracking-wider text-[var(--color-text-mute)]">[ DNA ] TOGGLE WHAT-IF SCENARIOS TO WATCH THE SHAPE MORPH.</p>
    </section>
  );
}

function pointFor(value: number, index: number, radius = radarRadius) {
  const angle = (index / dnaAxes.length) * Math.PI * 2 - Math.PI / 2;
  const normalized = Math.max(0, Math.min(100, value)) / 100;
  return { x: radarCenter + Math.cos(angle) * radius * normalized, y: radarCenter + Math.sin(angle) * radius * normalized };
}

function labelFor(index: number) {
  return pointFor(100, index, radarRadius + 15);
}

function pathFor(values: number[]) {
  return `${values.map((value, index) => {
    const p = pointFor(value, index);
    return `${index === 0 ? "M" : "L"}${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
  }).join(" ")} Z`;
}

function CountsPanel({ profile }: { profile: NeighborhoodProfile }) {
  const entries = Object.entries(profile.counts);
  return (
    <section className="terminal-panel grid grid-cols-2 gap-x-4 gap-y-2 p-4 text-xs uppercase sm:grid-cols-4">
      {entries.map(([label, value]) => <div key={label} className="flex justify-between gap-2"><span className="text-[var(--color-text-mute)]">{label}</span><span className="text-[var(--color-text)] tabular-nums">{value}</span></div>)}
    </section>
  );
}

function AnomalyPanel({ profile }: { profile: NeighborhoodProfile }) {
  return (
    <section className="terminal-panel p-4">
      <p className="terminal-label">[ ANOMALIES // SIGNALS ]</p>
      <div className="mt-3 space-y-2">{profile.anomalies.map((item) => <p key={item} className="border border-[var(--color-border)] bg-black p-2 text-xs uppercase leading-5 text-[var(--color-text-dim)]">&gt; {item}</p>)}</div>
    </section>
  );
}

function ForecastPanel({ profile }: { profile: NeighborhoodProfile }) {
  const max = Math.max(...profile.forecast);
  return (
    <section className="terminal-panel p-4">
      <p className="terminal-label">[ FORECAST // 6-MONTH ]</p>
      <div className="mt-4 flex h-28 items-end gap-2">
        {profile.forecast.map((value, index) => <div key={`${value}-${index}`} className="flex flex-1 flex-col items-center gap-2"><div className="w-full bg-[var(--color-accent)]" style={{ height: `${Math.max(12, (value / max) * 100)}%` }} /><span className="text-[10px] text-[var(--color-text-mute)]">{value}</span></div>)}
      </div>
    </section>
  );
}

function WhatIfPanel({ active, onToggle, profile }: { active: string[]; onToggle: (id: string) => void; profile: NeighborhoodProfile }) {
  return (
    <section className="terminal-panel p-4">
      <div className="flex justify-between border-b border-[var(--color-border)] pb-2">
        <p className="terminal-label">[ WHAT-IF // STACK SCENARIOS ]</p>
        <p className="text-[10px] uppercase tracking-widest text-[var(--color-text-mute)]">{active.length} ACTIVE</p>
      </div>
      <div className="mt-3 space-y-2">
        {scenarios.map((scenario) => {
          const on = active.includes(scenario.id);
          const single = applyScenarios(profile, [scenario.id]);
          return (
            <button key={scenario.id} type="button" onClick={() => onToggle(scenario.id)} className={`w-full border p-3 text-left transition ${on ? "border-[var(--color-accent)] bg-[#041310]" : "border-[var(--color-border)] bg-black hover:border-[var(--color-border-strong)]"}`}>
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-text)]"><span className={on ? "text-[var(--color-accent)]" : "text-[var(--color-text-mute)]"}>{on ? "[X]" : `[${scenario.emoji}]`}</span>{scenario.name}<span className={single.delta >= 0 ? "ml-auto text-[var(--color-accent)]" : "ml-auto text-[var(--color-bad)]"}>{single.delta >= 0 ? "+" : ""}{single.delta}</span></span>
              <span className="mt-2 block text-[10px] uppercase leading-5 tracking-wider text-[var(--color-text-mute)]">[ REASON ] {scenario.reason}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function NeighborhoodChat({ profile }: { profile: NeighborhoodProfile }) {
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string; mode?: string }>>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const lastMode = messages.findLast((message) => message.role === "assistant")?.mode;

  async function send(event: React.FormEvent) {
    event.preventDefault();
    const question = input.trim();
    if (!question || loading) return;
    setInput("");
    setMessages((items) => [...items, { role: "user", content: question }]);
    setLoading(true);
    try {
      const response = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: `${question}\n\nNeighborhood context: ${profile.name}. Score ${profile.score}. Signals: ${profile.signals.join("; ")}` })
      });
      const payload = (await response.json()) as { answer?: string; mode?: string };
      setMessages((items) => [...items, { role: "assistant", content: payload.answer ?? builtInNeighborhoodAnswer(profile, question), mode: payload.mode ?? "rules" }]);
    } catch {
      setMessages((items) => [...items, { role: "assistant", content: builtInNeighborhoodAnswer(profile, question), mode: "rules" }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="terminal-panel p-4">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2">
        <p className="terminal-label">[ ASK // NEIGHBORHOOD AI ]</p>
        <p className={lastMode === "ai" ? "text-[10px] uppercase tracking-widest text-[var(--color-accent)]" : "text-[10px] uppercase tracking-widest text-[var(--color-warn)]"}>{lastMode === "ai" ? "[ AI READY ]" : "[ BUILT-IN READY ]"}</p>
      </div>
      <div className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-1">
        {!messages.length ? <p className="text-xs uppercase leading-6 tracking-wider text-[var(--color-text-mute)]">[ SUGGESTIONS ]<br />&gt; IS THIS AREA GOOD FOR FAMILIES?<br />&gt; WHAT SHOULD CITY HALL FIX FIRST?<br />&gt; WHAT CHANGES THE SCORE FASTEST?</p> : null}
        {messages.map((message, index) => <div key={`${message.role}-${index}`} className={`border p-2 text-xs uppercase leading-5 ${message.role === "user" ? "ml-auto max-w-[85%] border-[var(--color-accent)] bg-[#041310]" : "max-w-[92%] border-[var(--color-border)] bg-black"}`}><p className="mb-1 text-[10px] tracking-widest text-[var(--color-accent)]">{message.role === "user" ? "[ YOU ]" : "[ AI ]"}</p>{message.content}</div>)}
        {loading ? <p className="terminal-label">[ AI THINKING<span className="cursor-blink">_</span> ]</p> : null}
      </div>
      <form onSubmit={send} className="mt-3 flex gap-2">
        <span className="flex items-center text-xs text-[var(--color-accent)]">&gt;_</span>
        <input value={input} onChange={(event) => setInput(event.target.value)} disabled={loading} placeholder="ASK ANYTHING..." className="min-w-0 flex-1 border border-[var(--color-border)] bg-black px-3 py-2 text-xs uppercase tracking-wide text-[var(--color-text)] placeholder:text-[var(--color-text-mute)] focus:border-[var(--color-accent)] focus:outline-none" />
        <button type="submit" disabled={loading || !input.trim()} className="border border-[var(--color-accent)] bg-[var(--color-accent)] px-4 py-2 text-xs font-bold uppercase tracking-widest text-black disabled:border-[var(--color-border)] disabled:bg-[var(--color-surface-3)] disabled:text-[var(--color-text-mute)]">[ SEND ]</button>
      </form>
    </section>
  );
}

function builtInNeighborhoodAnswer(profile: NeighborhoodProfile, question: string) {
  if (question.toLowerCase().includes("famil")) return `${profile.name} is strongest for services and transit. Watch the risk list before recommending it for families.`;
  if (question.toLowerCase().includes("fix")) return `Fix the highest-risk item first: ${profile.risks[0]}. That is the clearest civic action.`;
  return `${profile.name} scores ${profile.score}/100. Main signal: ${profile.signals[0]}`;
}

function LiveSources({ profile }: { profile: NeighborhoodProfile }) {
  if (!profile.liveLeads?.length) return null;
  return (
    <section className="terminal-panel p-4">
      <p className="terminal-label">[ LIVE SOURCES ]</p>
      <div className="mt-3 space-y-2">{profile.liveLeads.slice(0, 3).map((lead) => <a key={lead.title} href={lead.url} target="_blank" rel="noreferrer" className="block border border-[var(--color-border)] bg-black p-2 text-xs uppercase leading-5 text-[var(--color-text-dim)] hover:border-[var(--color-accent)]">{lead.title}</a>)}</div>
    </section>
  );
}

function ComparePanel({ profile, selectedId, onSelect }: { profile: NeighborhoodProfile; selectedId: string; onSelect: (id: string) => void }) {
  return (
    <section className="terminal-panel p-4">
      <select value={selectedId} onChange={(event) => onSelect(event.target.value)} className="w-full border border-[var(--color-border)] bg-black px-3 py-2 text-xs font-bold uppercase tracking-widest text-[var(--color-text)]">
        {neighborhoods.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
      </select>
      <div className="mt-4 flex items-baseline gap-2"><span className="text-5xl font-bold text-[var(--color-accent)]">{profile.score}</span><span className="text-sm text-[var(--color-text-mute)]">/100</span><span className="ml-auto text-xs uppercase text-[var(--color-text-dim)]">{profile.rank}</span></div>
      <p className="mt-3 text-xs uppercase leading-6 tracking-wider text-[var(--color-text-dim)]">{profile.summary}</p>
      <ScoreRadar base={profile.dna} modified={null} />
    </section>
  );
}

function ProposalCard({ proposal, onAct, onSkip, onDetail }: { proposal: CivicProposal; onAct: () => void; onSkip: () => void; onDetail: () => void }) {
  return (
    <article className="w-full max-w-2xl border border-[var(--color-border)] bg-black p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="terminal-label">[ {proposal.category} ]</p>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-warn)]">+{proposalScore(proposal)} IMPACT</p>
      </div>
      <h2 className="mt-5 text-3xl font-bold uppercase leading-tight tracking-tight text-[var(--color-text)]">{proposal.title}</h2>
      <p className="mt-2 text-[10px] uppercase tracking-widest text-[var(--color-text-mute)]">AREA: {proposal.area} · DATE: {proposal.meetingDate}</p>
      <p className="mt-5 border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-sm uppercase leading-7 tracking-wider text-[var(--color-text-dim)]">{proposal.summary}</p>
      <p className="mt-3 text-xs uppercase leading-6 tracking-wider text-[var(--color-text-mute)]">&gt; {proposal.civicAction}</p>
      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        <button type="button" onClick={onSkip} className="border border-[var(--color-border-strong)] px-3 py-2 text-xs font-bold uppercase tracking-widest text-[var(--color-text-dim)]">[ SKIP ]</button>
        <button type="button" onClick={onDetail} className="border border-[var(--color-border-strong)] px-3 py-2 text-xs font-bold uppercase tracking-widest text-[var(--color-text)]">[ DETAILS ]</button>
        <button type="button" onClick={onAct} className="border border-[var(--color-accent)] bg-[var(--color-accent)] px-3 py-2 text-xs font-bold uppercase tracking-widest text-black">[ ACT ]</button>
      </div>
    </article>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-auto border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-[var(--color-text)]">
        <div className="flex justify-between gap-4">
          <div><p className="terminal-label">[ ACTION DETAILS ]</p><h2 className="mt-2 text-2xl font-bold uppercase">{proposal.title}</h2></div>
          <button type="button" onClick={onClose} className="h-fit border border-[var(--color-border)] px-3 py-1 text-xs uppercase tracking-widest">[ CLOSE ]</button>
        </div>
        <textarea readOnly value={proposal.emailTemplate} rows={8} className="mt-5 w-full border border-[var(--color-border)] bg-black p-3 text-xs uppercase leading-6 tracking-wider text-[var(--color-text-dim)] outline-none" />
        <div className="mt-4 flex flex-wrap gap-2">
          <a href={mailto} className="inline-flex items-center gap-2 border border-[var(--color-accent)] bg-[var(--color-accent)] px-3 py-2 text-xs font-bold uppercase tracking-widest text-black"><Mail size={14} />[ EMAIL ]</a>
          <button type="button" onClick={addCalendar} className="inline-flex items-center gap-2 border border-[var(--color-border-strong)] px-3 py-2 text-xs font-bold uppercase tracking-widest text-[var(--color-text)]"><CalendarPlus size={14} />[ CALENDAR ]</button>
          <button type="button" onClick={copyTemplate} className="inline-flex items-center gap-2 border border-[var(--color-border-strong)] px-3 py-2 text-xs font-bold uppercase tracking-widest text-[var(--color-text)]"><Clipboard size={14} />[ COPY ]</button>
          <a href={proposal.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-[var(--color-border-strong)] px-3 py-2 text-xs font-bold uppercase tracking-widest text-[var(--color-text)]"><ExternalLink size={14} />[ SOURCE ]</a>
        </div>
      </div>
    </div>
  );
}
