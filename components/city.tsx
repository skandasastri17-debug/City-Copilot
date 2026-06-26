"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock3,
  Compass,
  FileText,
  Filter,
  Layers3,
  LocateFixed,
  Map,
  MapPin,
  MessageSquareText,
  Plus,
  Search,
  Send,
  Sparkles,
  UserRound,
  Workflow
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  CityCategory,
  CityReport,
  CityResource,
  CopilotResult,
  Priority,
  ReportStatus,
  classifyRequest,
  citySignals,
  examplePrompts,
  getCategoryIcon,
  reports,
  resourceFilters,
  resources,
  timelineSteps,
  torontoStats
} from "@/lib/city";
import type { LiveDataResult } from "@/lib/liveData";

const categoryStyles: Record<CityCategory, string> = {
  Infrastructure: "border-civic-blue/25 bg-civic-blue/10 text-civic-blue",
  Safety: "border-civic-red/25 bg-civic-red/10 text-civic-red",
  Transit: "border-civic-cyan/30 bg-civic-cyan/12 text-civic-ink",
  Environment: "border-civic-green/30 bg-civic-green/14 text-civic-ink",
  "Community Services": "border-civic-gold/35 bg-civic-gold/18 text-civic-ink",
  Housing: "border-civic-purple/25 bg-civic-purple/10 text-civic-purple",
  "Parks & Recreation": "border-civic-green/30 bg-civic-green/14 text-civic-ink",
  Other: "border-civic-line bg-white text-civic-muted"
};

const priorityStyles: Record<Priority, string> = {
  Low: "border-civic-line bg-white text-civic-muted",
  Medium: "border-civic-blue/20 bg-civic-blue/10 text-civic-blue",
  High: "border-civic-gold/30 bg-civic-gold/18 text-civic-ink",
  Urgent: "border-civic-red/25 bg-civic-red/10 text-civic-red"
};

const statusStyles: Record<ReportStatus, string> = {
  Draft: "border-civic-line bg-white text-civic-muted",
  Submitted: "border-civic-blue/20 bg-civic-blue/10 text-civic-blue",
  "In Review": "border-civic-gold/30 bg-civic-gold/18 text-civic-ink",
  "In Progress": "border-civic-cyan/30 bg-civic-cyan/12 text-civic-ink",
  Resolved: "border-civic-green/30 bg-civic-green/14 text-civic-ink"
};

export function CategoryBadge({ category }: { category: CityCategory }) {
  const Icon = getCategoryIcon(category);
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${categoryStyles[category]}`}>
      <Icon size={13} aria-hidden="true" />
      {category}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${priorityStyles[priority]}`}>{priority}</span>;
}

export function StatusBadge({ status }: { status: ReportStatus }) {
  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${statusStyles[status]}`}>{status}</span>;
}

export function FeatureCard({ title, body, icon: Icon }: { title: string; body: string; icon: React.ElementType }) {
  return (
    <article className="city-card group min-h-[210px] p-5 transition duration-300 hover:-translate-y-1 hover:border-civic-blue/30">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-civic-line bg-white text-civic-blue shadow-sm">
        <Icon size={20} aria-hidden="true" />
      </div>
      <h3 className="mt-5 text-xl font-extrabold tracking-[-0.02em] text-civic-ink">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-civic-muted">{body}</p>
      <ChevronRight className="mt-5 text-civic-red opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" size={18} aria-hidden="true" />
    </article>
  );
}

export function HeroSection() {
  return (
    <section className="overflow-hidden border-b border-civic-line">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-14">
        <div className="flex min-h-[520px] flex-col justify-center">
          <p className="font-utility inline-flex w-fit items-center gap-2 rounded-full border border-civic-line bg-white px-4 py-2 text-[11px] font-bold uppercase text-civic-muted shadow-sm">
            <Sparkles size={14} aria-hidden="true" />
            Toronto civic intelligence demo
          </p>
          <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.96] tracking-[-0.04em] text-civic-ink sm:text-7xl">
            City Copilot
          </h1>
          <p className="mt-4 max-w-2xl text-2xl font-extrabold tracking-[-0.02em] text-civic-blue sm:text-3xl">One assistant for every city service.</p>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-civic-muted">
            Describe a problem, find a resource, or improve your neighborhood. City Copilot turns everyday resident needs into clear civic action.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/assistant" className="inline-flex items-center gap-2 rounded-full bg-civic-red px-5 py-3 text-sm font-extrabold text-white shadow-[0_18px_34px_rgba(218,41,28,0.24)] transition hover:-translate-y-0.5">
              Try the Copilot <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/reports" className="inline-flex items-center gap-2 rounded-full border border-civic-line bg-white px-5 py-3 text-sm font-bold text-civic-ink shadow-sm transition hover:-translate-y-0.5">
              View Demo Reports
            </Link>
          </div>
          <div className="mt-9 grid gap-3 sm:grid-cols-3">
            {torontoStats.map((stat) => (
              <div key={stat.label} className="border-l-2 border-civic-blue/30 pl-4">
                <p className="text-3xl font-black tracking-[-0.03em] text-civic-ink">{stat.value}</p>
                <p className="mt-1 text-xs font-bold uppercase text-civic-muted">{stat.label}</p>
                <p className="mt-1 text-sm text-civic-muted">{stat.detail}</p>
              </div>
            ))}
          </div>
        </div>
        <TorontoOpsPanel />
      </div>
    </section>
  );
}

function TorontoOpsPanel() {
  return (
    <div className="relative min-h-[520px] overflow-hidden rounded-[28px] border border-civic-line bg-civic-ink p-5 text-white shadow-[0_30px_80px_rgba(17,37,63,0.25)]">
      <div className="city-map absolute inset-0 opacity-35" />
      <div className="relative z-10 flex h-full flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-utility text-[11px] font-bold uppercase text-white/60">Live civic desk</p>
            <h2 className="mt-2 max-w-sm text-3xl font-black tracking-[-0.03em]">Toronto requests, routed before residents know the department.</h2>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur">
            <Map size={22} aria-hidden="true" />
          </div>
        </div>
        <div className="my-8 grid grid-cols-2 gap-3">
          {citySignals.map((signal) => (
            <div key={signal.label} className="rounded-2xl border border-white/12 bg-white/[0.08] p-4 backdrop-blur">
              <signal.icon className="text-civic-cyan" size={18} aria-hidden="true" />
              <p className="mt-4 text-sm font-bold">{signal.label}</p>
              <p className="mt-1 text-sm text-white/62">{signal.value}</p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-white/12 bg-white/[0.09] p-4 backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-bold text-white/72">Latest synthetic intake</p>
            <span className="rounded-full bg-civic-green px-3 py-1 text-xs font-black text-civic-ink">92% routed</span>
          </div>
          <p className="mt-3 text-lg font-extrabold">Recurring flooding near Queen and Dufferin</p>
          <div className="mt-4 h-2 rounded-full bg-white/12">
            <div className="h-2 w-[72%] rounded-full bg-civic-cyan" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function HowItWorks() {
  const steps = [
    ["Describe the issue", "Residents use plain language, photos or location details later."],
    ["AI understands the request", "The MVP uses transparent rules to classify service intent."],
    ["City Copilot creates an action plan", "Reports become department-ready summaries with next steps."],
    ["Track progress", "Residents see status, routing, and response expectations."]
  ];

  return (
    <section className="border-t border-civic-line bg-white/54">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="font-utility text-[11px] font-bold uppercase text-civic-muted">How it works</p>
          <h2 className="mt-2 text-4xl font-black tracking-[-0.03em] text-civic-ink">From resident sentence to city workflow.</h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {steps.map(([title, body], index) => (
            <article key={title} className="relative border-t-2 border-civic-blue/25 pt-5">
              <span className="font-utility text-xs font-black text-civic-red">0{index + 1}</span>
              <h3 className="mt-3 text-lg font-extrabold text-civic-ink">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-civic-muted">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DemoPromptButton({ prompt, onSelect }: { prompt: string; onSelect: (prompt: string) => void }) {
  return (
    <button onClick={() => onSelect(prompt)} className="rounded-full border border-white/12 bg-transparent px-4 py-2 text-left text-sm font-semibold text-white/62 transition hover:border-white/24 hover:bg-white/5 hover:text-white">
      {prompt}
    </button>
  );
}

export function ChatInput({ value, onChange, onSubmit }: { value: string; onChange: (value: string) => void; onSubmit: () => void }) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="rounded-[28px] border border-white/12 bg-[#222] p-2 shadow-[0_20px_70px_rgba(0,0,0,0.34)]"
    >
      <label className="sr-only" htmlFor="city-request">
        Describe your city request
      </label>
      <div className="flex items-center gap-2">
        <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full text-white/78 sm:flex">
          <Plus size={25} aria-hidden="true" />
        </span>
        <textarea
          id="city-request"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Ask about a Toronto city service"
          rows={2}
          className="min-h-[52px] flex-1 resize-none border-0 bg-transparent px-2 py-3 text-base text-white outline-none placeholder:text-white/42 focus:ring-0 sm:min-h-0"
        />
        <span className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-white/46 md:flex">
          Toronto
        </span>
        <button type="submit" className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#da291c] text-white transition hover:scale-105" aria-label="Ask Copilot">
          <Send size={19} aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}

export function AssistantWorkspace() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<CopilotResult | null>(null);
  const [userPrompt, setUserPrompt] = useState("");
  const [liveData, setLiveData] = useState<LiveDataResult | null>(null);
  const [isSearchingLiveData, setIsSearchingLiveData] = useState(false);
  const hasAsked = Boolean(result && userPrompt);

  function submit() {
    if (!input.trim()) return;
    const query = input.trim();
    const nextResult = classifyRequest(query);

    setUserPrompt(query);
    setResult(nextResult);
    setIsSearchingLiveData(true);
    setLiveData(null);

    fetch("/api/live-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, category: nextResult.category })
    })
      .then((response) => {
        if (!response.ok) throw new Error("Live data search failed");
        return response.json() as Promise<LiveDataResult>;
      })
      .then(setLiveData)
      .catch(() =>
        setLiveData({
          query,
          category: nextResult.category,
          leads: [],
          searchedAt: new Date().toISOString(),
          error: "Live data search is unavailable right now."
        })
      )
      .finally(() => setIsSearchingLiveData(false));
  }

  return (
    <main className="toronto-chat-canvas min-h-[calc(100vh-57px)] bg-black text-white lg:min-h-screen">
      {!hasAsked ? (
        <section className="mx-auto flex min-h-[calc(100vh-57px)] max-w-5xl flex-col items-center justify-center px-4 pb-20 lg:min-h-screen">
          <p className="mb-4 rounded-full border border-[#da291c]/35 bg-[#da291c]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white/70">City of Toronto inspired</p>
          <h1 className="text-center text-3xl font-normal tracking-[-0.03em] text-white sm:text-4xl">Ready when you are.</h1>
          <p className="mt-3 max-w-xl text-center text-sm leading-6 text-white/48">Ask about services, reports, resources, or neighborhood improvements.</p>
          <div className="mt-10 w-full max-w-3xl">
            <ChatInput value={input} onChange={setInput} onSubmit={submit} />
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {examplePrompts.slice(0, 4).map((prompt) => (
              <DemoPromptButton key={prompt} prompt={prompt} onSelect={setInput} />
            ))}
          </div>
        </section>
      ) : (
        <section className="mx-auto flex min-h-screen max-w-4xl flex-col px-4 py-8">
          <div className="flex-1 space-y-8">
            <ChatBubble role="user">
              <p className="text-base font-medium leading-7 text-white">{userPrompt}</p>
            </ChatBubble>
            {result ? (
              <ChatBubble role="assistant" wide>
                <CopilotResponseCard result={result} liveData={liveData} isSearchingLiveData={isSearchingLiveData} />
              </ChatBubble>
            ) : null}
          </div>
          <div className="sticky bottom-4 mt-8">
            <ChatInput value={input} onChange={setInput} onSubmit={submit} />
          </div>
        </section>
      )}
    </main>
  );
}

function ChatBubble({ role, children, wide = false }: { role: "assistant" | "user"; children: React.ReactNode; wide?: boolean }) {
  const isUser = role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser ? (
        <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-civic-ink text-white">
          <Bot size={18} aria-hidden="true" />
        </span>
      ) : null}
      <div className={wide ? "w-full max-w-[980px]" : `max-w-[760px] rounded-[24px] border ${isUser ? "border-civic-blue/20 bg-civic-blue/10" : "border-civic-line bg-white"} p-4 shadow-sm`}>
        {children}
      </div>
      {isUser ? (
        <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-civic-blue text-white">
          <UserRound size={18} aria-hidden="true" />
        </span>
      ) : null}
    </div>
  );
}

export function CopilotResponseCard({
  result,
  liveData,
  isSearchingLiveData = false
}: {
  result: CopilotResult;
  liveData?: LiveDataResult | null;
  isSearchingLiveData?: boolean;
}) {
  return (
    <section className="space-y-4">
      <div className="rounded-[26px] border border-white/10 bg-[#171717] p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-utility text-[11px] font-bold uppercase text-white/45">Copilot answer</p>
            <h2 className="mt-1 text-2xl font-black tracking-[-0.03em] text-white">Route this to {result.report.department}.</h2>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-white/58">{result.confidence}% confident</span>
        </div>
        <p className="mt-4 rounded-2xl border border-civic-cyan/20 bg-civic-cyan/10 p-4 text-lg font-black leading-8 tracking-[-0.02em] text-white">
          {clearAnswerFor(result)}
        </p>
        <p className="mt-4 max-w-3xl text-base leading-7 text-white/62">{result.summary}</p>
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <AnswerFact label="Type" value={result.category} />
          <AnswerFact label="Priority" value={result.report.priority} />
          <AnswerFact label="Status" value={result.report.status} />
          <AnswerFact label="Response" value={result.report.estimatedResponseTime} />
        </div>
      </div>

      <div className="overflow-hidden rounded-[26px] border border-white/10 bg-[#171717] shadow-sm">
        <div className="grid md:grid-cols-[190px_1fr]">
          <div className="routing-rail border-b border-civic-line p-5 text-white md:border-b-0 md:border-r">
            <p className="font-utility text-[11px] font-bold uppercase text-white/62">311 routing</p>
            <div className="mt-5 space-y-4">
              <RailStep done label="Classified" value={result.category} />
              <RailStep done label="Department" value={result.report.department} />
              <RailStep label="Location" value="Needs confirmation" />
            </div>
          </div>
          <div className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <CategoryBadge category={result.category} />
                <PriorityBadge priority={result.report.priority} />
              </div>
              <span className="font-utility text-[11px] font-bold uppercase text-white/45">Draft report</span>
            </div>
            <h3 className="mt-4 text-2xl font-black tracking-[-0.03em] text-white">{result.report.title}</h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <ReportField label="Suggested department" value={result.report.department} />
              <ReportField label="Location needed" value={result.report.location} />
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <ReadableBlock title="Clean city description" body={result.report.description} />
              <ReadableBlock title="Recommended next step" body={result.report.nextStep} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[26px] border border-white/10 bg-[#171717] p-5 shadow-sm">
          <h3 className="flex items-center gap-2 text-lg font-extrabold text-white">
            <Workflow size={18} aria-hidden="true" />
            Suggested actions
          </h3>
          <div className="mt-4 grid gap-2">
            {result.suggestedActions.map((action) => (
              <Link key={action} href={actionHref(action)} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-bold text-white/82 transition hover:border-white/20 hover:bg-white/10">
                {action}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
        <div className="rounded-[26px] border border-white/10 bg-[#171717] p-5 shadow-sm">
          <h3 className="flex items-center gap-2 text-lg font-extrabold text-white">
            <LocateFixed size={18} aria-hidden="true" />
            Similar nearby issues
          </h3>
          <div className="mt-4 space-y-3">
            {result.similarIssues.length ? (
              result.similarIssues.map((issue) => (
                <div key={issue.id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <p className="text-sm font-bold text-white/86">{issue.title}</p>
                  <p className="mt-1 text-xs text-white/50">{issue.location}</p>
                </div>
              ))
            ) : (
              <EmptyState title="No similar reports yet" body="This request would start a new issue cluster in the demo data." />
            )}
          </div>
        </div>
      </div>

      <LiveDataPanel liveData={liveData} isSearching={isSearchingLiveData} />
    </section>
  );
}

function LiveDataPanel({ liveData, isSearching }: { liveData?: LiveDataResult | null; isSearching: boolean }) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-[#171717] p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-utility text-[11px] font-bold uppercase text-white/45">Live data leads</p>
          <h3 className="mt-1 text-lg font-extrabold text-white">Datasets and resources that may support this answer</h3>
        </div>
        {isSearching ? (
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-white/58">Searching...</span>
        ) : null}
      </div>

      {isSearching ? (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {[1, 2].map((item) => (
            <div key={item} className="h-28 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : liveData?.leads.length ? (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {liveData.leads.map((lead) => (
            <a
              key={`${lead.source}-${lead.title}`}
              href={lead.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20 hover:bg-white/10"
            >
              <span className="rounded-full bg-white/8 px-3 py-1 text-[11px] font-bold uppercase text-white/54">{lead.source}</span>
              <p className="mt-3 text-sm font-extrabold leading-5 text-white/88">{lead.title}</p>
              <p className="mt-2 text-sm leading-6 text-white/58">{lead.description}</p>
              {lead.formats?.length ? <p className="mt-3 text-xs font-bold text-civic-blue">Formats: {lead.formats.slice(0, 4).join(", ")}</p> : null}
            </a>
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-white/58">
          {liveData?.error ?? "Ask Copilot a question to search live datasets and resource matches."}
        </p>
      )}
    </div>
  );
}

function clearAnswerFor(result: CopilotResult) {
  if (result.category === "Community Services") {
    return `Yes. This looks like a community service request, so I would start by matching the resident with ${result.report.department} resources.`;
  }

  if (result.category === "Other") {
    return "I can help, but I need one more detail before routing this confidently: the service type, location, or department you think it belongs to.";
  }

  return `Yes. This should be treated as a ${result.report.priority.toLowerCase()}-priority ${result.category.toLowerCase()} request and routed to ${result.report.department}.`;
}

function actionHref(action: string) {
  const lower = action.toLowerCase();
  if (lower.includes("resource") || lower.includes("eligibility") || lower.includes("contact")) return "/resources";
  if (lower.includes("similar") || lower.includes("submit") || lower.includes("report")) return "/reports";
  return "/";
}

function RailStep({ label, value, done = false }: { label: string; value: string; done?: boolean }) {
  return (
    <div className="flex gap-3">
      <span className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${done ? "border-civic-cyan bg-civic-cyan text-civic-ink" : "border-white/28 bg-white/10 text-white/70"}`}>
        {done ? <CheckCircle2 size={13} aria-hidden="true" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      </span>
      <span>
        <span className="block text-[10px] font-bold uppercase text-white/56">{label}</span>
        <span className="mt-0.5 block text-sm font-extrabold leading-5 text-white">{value}</span>
      </span>
    </div>
  );
}

function AnswerFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs font-bold uppercase text-white/45">{label}</p>
      <p className="mt-1 text-base font-black tracking-[-0.02em] text-white">{value}</p>
    </div>
  );
}

function ReportField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs font-bold uppercase text-white/45">{label}</p>
      <p className="mt-1 text-sm font-extrabold leading-6 text-white/86">{value}</p>
    </div>
  );
}

function ReadableBlock({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-sm font-extrabold text-white">{title}</p>
      <p className="mt-2 text-sm leading-7 text-white/58">{body}</p>
    </div>
  );
}

export function ReportCard({ report, detailed = false, onClick, active = false }: { report: CityReport; detailed?: boolean; onClick?: () => void; active?: boolean }) {
  const Wrapper = onClick ? "button" : "article";
  return (
    <Wrapper onClick={onClick} className={`city-card block w-full p-5 text-left transition ${active ? "border-civic-blue/45 ring-2 ring-civic-blue/15" : ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-utility text-[11px] font-bold uppercase text-civic-muted">{report.id}</p>
          <h3 className="mt-2 text-xl font-extrabold tracking-[-0.02em] text-civic-ink">{report.title}</h3>
        </div>
        <StatusBadge status={report.status} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <CategoryBadge category={report.category} />
        <PriorityBadge priority={report.priority} />
      </div>
      <div className="mt-5 grid gap-3 text-sm text-civic-muted sm:grid-cols-2">
        <InfoRow icon={BuildingIcon} label="Department" value={report.department} />
        <InfoRow icon={Clock3} label="Response" value={report.estimatedResponseTime} />
        <InfoRow icon={MapPin} label="Location" value={report.location} />
        <InfoRow icon={FileText} label="Created" value={report.createdDate} />
      </div>
      {detailed ? (
        <div className="mt-5 rounded-2xl border border-civic-line bg-white p-4">
          <p className="text-sm font-bold text-civic-ink">City-ready description</p>
          <p className="mt-2 text-sm leading-6 text-civic-muted">{report.description}</p>
          <p className="mt-4 text-sm font-bold text-civic-ink">Recommended next step</p>
          <p className="mt-2 text-sm leading-6 text-civic-muted">{report.nextStep}</p>
        </div>
      ) : null}
    </Wrapper>
  );
}

function BuildingIcon(props: { size?: number; className?: string; "aria-hidden"?: boolean }) {
  return <Layers3 {...props} />;
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 text-civic-blue" size={15} aria-hidden="true" />
      <span>
        <span className="block text-xs font-bold uppercase text-civic-muted/80">{label}</span>
        <span className="font-semibold text-civic-ink">{value}</span>
      </span>
    </div>
  );
}

export function ReportTimeline({ report }: { report: CityReport }) {
  const statusIndex = report.status === "Resolved" ? 4 : report.status === "In Progress" ? 3 : report.status === "In Review" ? 2 : report.status === "Submitted" ? 1 : 0;
  return (
    <div className="city-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-utility text-[11px] font-bold uppercase text-civic-muted">Tracking timeline</p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-civic-ink">{report.title}</h2>
        </div>
        <StatusBadge status={report.status} />
      </div>
      <div className="mt-7 space-y-4">
        {timelineSteps.map((step, index) => {
          const done = index <= statusIndex;
          return (
            <div key={step} className="grid grid-cols-[2rem_1fr] gap-3">
              <div className="flex flex-col items-center">
                <span className={`flex h-8 w-8 items-center justify-center rounded-full border ${done ? "border-civic-blue bg-civic-blue text-white" : "border-civic-line bg-white text-civic-muted"}`}>
                  {done ? <CheckCircle2 size={16} aria-hidden="true" /> : index + 1}
                </span>
                {index < timelineSteps.length - 1 ? <span className={`h-10 w-px ${done ? "bg-civic-blue" : "bg-civic-line"}`} /> : null}
              </div>
              <div className="pb-4">
                <p className="font-bold text-civic-ink">{step}</p>
                <p className="mt-1 text-sm text-civic-muted">{timelineCopy(step, report)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function timelineCopy(step: string, report: CityReport) {
  const copy: Record<string, string> = {
    Submitted: `Resident request logged with ${report.id}.`,
    "Routed to department": `Assigned to ${report.department}.`,
    "Under review": "Service team is checking eligibility, location, and operational notes.",
    "Field team assigned": "A crew or program owner is scheduled to investigate.",
    Resolved: "The issue is closed or the resident has received the relevant next step."
  };
  return copy[step];
}

export function ReportsWorkspace() {
  const [selectedId, setSelectedId] = useState(reports[0].id);
  const selected = reports.find((report) => report.id === selectedId) ?? reports[0];

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[0.88fr_1.12fr] lg:px-8 lg:py-10">
      <section>
        <p className="font-utility text-[11px] font-bold uppercase text-civic-muted">Report tracking</p>
        <h1 className="mt-2 text-4xl font-black tracking-[-0.03em] text-civic-ink">Demo reports moving through Toronto workflows.</h1>
        <div className="mt-6 grid gap-4">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} onClick={() => setSelectedId(report.id)} active={report.id === selectedId} />
          ))}
        </div>
      </section>
      <section className="space-y-5">
        <ReportTimeline report={selected} />
        <ReportCard report={selected} detailed />
      </section>
    </main>
  );
}

export function ResourceCard({ resource }: { resource: CityResource }) {
  const Icon = resource.icon;
  const [saved, setSaved] = useState(false);

  return (
    <article className="city-card flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-civic-line bg-white text-civic-blue">
          <Icon size={20} aria-hidden="true" />
        </div>
        <span className="rounded-full border border-civic-line bg-white px-3 py-1 text-xs font-bold text-civic-muted">{resource.category}</span>
      </div>
      <h3 className="mt-5 text-xl font-extrabold tracking-[-0.02em] text-civic-ink">{resource.name}</h3>
      <p className="mt-3 text-sm leading-6 text-civic-muted">{resource.description}</p>
      <div className="mt-4 space-y-3 text-sm">
        <p><span className="font-bold text-civic-ink">Eligibility:</span> <span className="text-civic-muted">{resource.eligibility}</span></p>
        <p><span className="font-bold text-civic-ink">Location:</span> <span className="text-civic-muted">{resource.location}</span></p>
        <p><span className="font-bold text-civic-ink">Contact:</span> <span className="text-civic-muted">{resource.contact}</span></p>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {resource.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-civic-paper px-3 py-1 text-xs font-bold text-civic-muted">{tag}</span>
        ))}
      </div>
      <button
        onClick={() => setSaved((current) => !current)}
        className={`mt-auto inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-extrabold transition ${
          saved ? "border-civic-green/40 bg-civic-green/20 text-white" : "border-white/10 bg-white/5 text-white/86 hover:border-white/20 hover:bg-white/10"
        }`}
      >
        {saved ? "Saved" : "Save Resource"} <Plus className={saved ? "rotate-45" : ""} size={16} aria-hidden="true" />
      </button>
    </article>
  );
}

export function ResourceFinder() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const visible = useMemo(() => {
    return resources.filter((resource) => {
      const matchesFilter = filter === "All" || resource.tags.includes(filter);
      const haystack = `${resource.name} ${resource.category} ${resource.description} ${resource.eligibility}`.toLowerCase();
      return matchesFilter && haystack.includes(query.toLowerCase());
    });
  }, [query, filter]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <aside>
          <p className="font-utility text-[11px] font-bold uppercase text-civic-muted">Resource finder</p>
          <h1 className="mt-2 text-4xl font-black tracking-[-0.03em] text-civic-ink">Find Toronto programs without knowing the right department.</h1>
          <div className="city-card mt-6 p-4">
            <label className="flex items-center gap-2 rounded-2xl border border-civic-line bg-white px-4 py-3">
              <Search className="text-civic-blue" size={18} aria-hidden="true" />
              <span className="sr-only">Search resources</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search coding, cooling, seniors..." className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-civic-muted/70" />
            </label>
            <div className="mt-4 flex items-center gap-2 text-sm font-bold text-civic-ink">
              <Filter size={16} aria-hidden="true" />
              Filters
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {["All", ...resourceFilters].map((item) => (
                <button key={item} onClick={() => setFilter(item)} className={`rounded-full border px-3 py-2 text-xs font-bold transition ${filter === item ? "border-civic-blue bg-civic-blue text-white" : "border-civic-line bg-white text-civic-muted hover:text-civic-ink"}`}>
                  {item}
                </button>
              ))}
            </div>
          </div>
        </aside>
        <section className="grid gap-4 md:grid-cols-2">
          {visible.length ? visible.map((resource) => <ResourceCard key={resource.id} resource={resource} />) : <EmptyState title="No matching resources" body="Try a broader search or remove the current filter." />}
        </section>
      </div>
    </main>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-civic-line bg-white/70 p-5 text-center">
      <MessageSquareText className="mx-auto text-civic-blue" size={24} aria-hidden="true" />
      <p className="mt-3 font-extrabold text-civic-ink">{title}</p>
      <p className="mt-1 text-sm text-civic-muted">{body}</p>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-civic-line bg-white/60">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-civic-muted sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <p className="font-bold text-civic-ink">City Copilot</p>
        <p>Hackathon MVP using mock Toronto data, local classification, and simulated service tracking.</p>
      </div>
    </footer>
  );
}

export function LandingFeatures() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-4 md:grid-cols-3">
        <FeatureCard title="Report city issues" body="Convert potholes, icy sidewalks, broken lights, flooding, and waste concerns into structured 311-ready drafts." icon={ClipboardList} />
        <FeatureCard title="Find local resources" body="Match residents to Toronto supports like cooling centres, coding programs, fee assistance, and settlement services." icon={Compass} />
        <FeatureCard title="Suggest neighborhood improvements" body="Turn unsafe intersections, missing shade, and transit reliability concerns into clear civic proposals." icon={MapPin} />
      </div>
    </section>
  );
}
