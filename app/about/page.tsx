import { Accessibility, AudioLines, BrainCircuit, Languages, MapPinned, PlugZap, Radar, ShieldCheck } from "lucide-react";
import { Footer } from "@/components/city";

const sections = [
  {
    title: "The problem",
    body: "City services are fragmented. Residents often do not know which department handles what, what language to use, or how to track progress after they ask for help."
  },
  {
    title: "The solution",
    body: "City Copilot turns natural language requests into structured civic action: classification, summaries, report drafts, resource matches, and simulated tracking."
  },
  {
    title: "Why it matters",
    body: "Better access, faster reporting, improved trust, and more inclusive city services. A good civic interface should reduce the burden on residents, not ask them to understand the org chart."
  }
];

const future = [
  ["Real city API integrations", PlugZap],
  ["Multilingual support", Languages],
  ["Voice input", AudioLines],
  ["Accessibility-first design", Accessibility],
  ["Predictive city maintenance", Radar],
  ["Live neighborhood issue maps", MapPinned],
  ["Integration with 311 systems", ShieldCheck],
  ["Personalized resident dashboards", BrainCircuit]
];

export default function AboutPage() {
  return (
    <>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="font-utility text-[11px] font-bold uppercase text-civic-muted">Hackathon demo</p>
            <h1 className="mt-2 text-5xl font-black leading-tight tracking-[-0.04em] text-civic-ink">A future Toronto service desk residents can actually use.</h1>
          </div>
          <div className="city-card p-6">
            <p className="text-lg font-semibold leading-8 text-civic-ink">
              City Copilot is intentionally built with mock data and transparent rules for the MVP. The point is to show the product behavior clearly: a resident speaks naturally, the system shapes that request into civic action, and the city workflow becomes understandable.
            </p>
          </div>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          {sections.map((section) => (
            <article key={section.title} className="city-card p-5">
              <h2 className="text-2xl font-black tracking-[-0.03em] text-civic-ink">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-civic-muted">{section.body}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 border-t border-civic-line pt-10">
          <div className="max-w-2xl">
            <p className="font-utility text-[11px] font-bold uppercase text-civic-muted">Future vision</p>
            <h2 className="mt-2 text-4xl font-black tracking-[-0.03em] text-civic-ink">Where the prototype goes next.</h2>
          </div>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {future.map(([label, Icon]) => (
              <div key={label as string} className="flex items-center gap-3 rounded-2xl border border-civic-line bg-white/72 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-civic-blue/10 text-civic-blue">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <span className="text-sm font-extrabold text-civic-ink">{label as string}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
