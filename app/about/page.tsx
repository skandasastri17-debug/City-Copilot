import { Accessibility, AudioLines, BrainCircuit, Languages, MapPinned, PlugZap, Radar, ShieldCheck } from "lucide-react";
import { Footer } from "@/components/city";

const sections = [
  {
    label: "[ PROBLEM ]",
    title: "Residents should not need the org chart.",
    body: "City services are split across departments, forms, and program pages. City Copilot turns a plain sentence into a clear civic path."
  },
  {
    label: "[ SOLUTION ]",
    title: "One command line for civic action.",
    body: "Ask a question, get routing, next steps, a clean request summary, and an email draft when outreach is useful."
  },
  {
    label: "[ IMPACT ]",
    title: "Less guessing. More action.",
    body: "The app is built for residents who need a quick, understandable answer before they know which city service applies."
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
      <main className="min-h-[calc(100vh-57px)] bg-black px-4 py-4 text-[var(--color-text)] lg:min-h-screen lg:px-6">
        <div className="mx-auto max-w-7xl space-y-4">
          <section className="terminal-panel p-4">
            <p className="terminal-label">[ ABOUT // CITY COPILOT ]</p>
            <div className="mt-4 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <h1 className="text-3xl font-bold uppercase leading-tight tracking-tight text-[var(--color-text)] sm:text-5xl">
                A Toronto service desk that answers like a person and routes like a system.
              </h1>
              <p className="border border-[var(--color-border)] bg-black p-4 text-xs uppercase leading-6 tracking-wider text-[var(--color-text-dim)]">
                &gt; Built as a hackathon MVP, City Copilot combines civic request routing, neighborhood intelligence, proposal matching, and AI-drafted outreach into one local-first dashboard.
              </p>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            {sections.map((section) => (
              <article key={section.label} className="terminal-panel p-4">
                <p className="terminal-label">{section.label}</p>
                <h2 className="mt-3 text-xl font-bold uppercase leading-snug text-[var(--color-accent)]">{section.title}</h2>
                <p className="mt-3 text-xs uppercase leading-6 tracking-wider text-[var(--color-text-dim)]">{section.body}</p>
              </article>
            ))}
          </section>

          <section className="terminal-panel p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="terminal-label">[ NEXT BUILD ]</p>
                <h2 className="mt-2 text-2xl font-bold uppercase tracking-tight text-[var(--color-text)]">Where the prototype goes next</h2>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-[var(--color-text-mute)]">ROADMAP // PRESENTABLE</span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {future.map(([label, Icon]) => (
                <div key={label as string} className="flex items-center gap-3 border border-[var(--color-border)] bg-black p-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-[var(--color-accent)] text-[var(--color-accent)]">
                    <Icon size={16} aria-hidden="true" />
                  </span>
                  <span className="text-xs font-bold uppercase leading-5 tracking-wider text-[var(--color-text-dim)]">{label as string}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
