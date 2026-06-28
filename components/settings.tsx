"use client";

import { Check, Clipboard, Eye, EyeOff, KeyRound, Link2, RotateCcw, Save, ShieldCheck, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { defaultLocalSettings, getCopilotRequestConfig, LOCAL_SETTINGS_KEY, normalizeLocalSettings, type AiProvider, type LocalCopilotSettings } from "@/lib/localSettings";

type ConnectionStatus = "idle" | "saved" | "missing" | "ai-ready" | "fallback" | "copied" | "cleared";

const providerLabels: Record<AiProvider, string> = {
  vultr: "Vultr",
  openai: "OpenAI",
  compatible: "OpenAI-compatible"
};

export function SettingsWorkspace() {
  const [settings, setSettings] = useState<LocalCopilotSettings>(defaultLocalSettings);
  const [showSecrets, setShowSecrets] = useState(false);
  const [status, setStatus] = useState<ConnectionStatus>("idle");
  const [loaded, setLoaded] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(LOCAL_SETTINGS_KEY);
    if (saved) {
      try {
        setSettings(normalizeLocalSettings(JSON.parse(saved)));
      } catch {
        setSettings(defaultLocalSettings);
      }
    }
    setLoaded(true);
  }, []);

  const readiness = useMemo(() => {
    const checks = [
      Boolean(settings.apiKey.trim()),
      settings.provider === "openai" || Boolean(settings.baseUrl.trim()),
      Boolean(settings.model.trim()),
      Boolean(settings.defaultCity.trim()),
      settings.useLiveData
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [settings]);

  function update<K extends keyof LocalCopilotSettings>(key: K, value: LocalCopilotSettings[K]) {
    setSettings((current) => ({ ...current, [key]: value }));
    setStatus("idle");
  }

  function saveSettings() {
    window.localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(settings));
    setStatus("saved");
  }

  function clearSettings() {
    window.localStorage.removeItem(LOCAL_SETTINGS_KEY);
    setSettings(defaultLocalSettings);
    setStatus("cleared");
  }

  async function testAi() {
    if (!settings.apiKey.trim() || (settings.provider !== "openai" && !settings.baseUrl.trim())) {
      setStatus("missing");
      return;
    }

    setTesting(true);
    saveSettings();
    try {
      const response = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: "Reply with one short sentence confirming City Copilot AI is connected.",
          ...getCopilotRequestConfig(settings)
        })
      });
      const payload = (await response.json()) as { mode?: string };
      setStatus(response.ok && payload.mode === "ai" ? "ai-ready" : "fallback");
    } catch {
      setStatus("fallback");
    } finally {
      setTesting(false);
    }
  }

  async function copyEnvTemplate() {
    const template = [
      `VULTR_API_KEY=${settings.provider === "vultr" && settings.apiKey ? settings.apiKey : "replace-with-your-vultr-key"}`,
      `VULTR_API_BASE_URL=${settings.provider === "vultr" && settings.baseUrl ? settings.baseUrl : "https://your-vultr-openai-compatible-endpoint/v1"}`,
      `VULTR_MODEL=${settings.provider === "vultr" && settings.model ? settings.model : "minimax-m2.7"}`,
      `OPENAI_API_KEY=${settings.provider === "openai" && settings.apiKey ? settings.apiKey : "optional"}`,
      `AI_API_KEY=${settings.provider === "compatible" && settings.apiKey ? settings.apiKey : "optional"}`,
      `AI_BASE_URL=${settings.provider === "compatible" && settings.baseUrl ? settings.baseUrl : "optional"}`,
      `AI_MODEL=${settings.provider === "compatible" && settings.model ? settings.model : "optional"}`,
      `TORONTO_OPEN_DATA_APP_TOKEN=${settings.torontoToken || "optional"}`
    ].join("\n");

    await window.navigator.clipboard.writeText(template);
    setStatus("copied");
  }

  return (
    <main className="min-h-[calc(100vh-57px)] bg-black px-4 py-4 text-[var(--color-text)] lg:min-h-screen lg:px-6">
      <div className="mx-auto max-w-6xl space-y-4">
        <header className="terminal-panel p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="terminal-label">[ SETTINGS // LOCAL CONTROL ]</p>
              <h1 className="mt-2 text-2xl font-bold uppercase tracking-tight text-[var(--color-text)]">Configure City Copilot</h1>
              <p className="mt-2 max-w-3xl text-xs uppercase leading-6 tracking-wider text-[var(--color-text-dim)]">
                &gt; Paste local demo keys here. They stay in this browser and are sent only to this app&apos;s API routes.
              </p>
            </div>
            <button type="button" onClick={() => setShowSecrets((visible) => !visible)} className="inline-flex items-center justify-center gap-2 border border-[var(--color-border-strong)] px-4 py-2 text-xs font-bold uppercase tracking-widest text-[var(--color-text-dim)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]">
              {showSecrets ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
              {showSecrets ? "[ HIDE KEYS ]" : "[ SHOW KEYS ]"}
            </button>
          </div>
        </header>

        <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
          <section className="space-y-4">
            <SettingsGroup icon={KeyRound} label="[ AI PROVIDER ]" title="AI connection">
              <SettingsSelect label="Provider" value={settings.provider} onChange={(value) => update("provider", value as AiProvider)}>
                <option value="vultr">Vultr</option>
                <option value="openai">OpenAI</option>
                <option value="compatible">OpenAI-compatible</option>
              </SettingsSelect>
              <SettingsInput label={`${providerLabels[settings.provider]} API key`} value={settings.apiKey} type={showSecrets ? "text" : "password"} placeholder="Paste API key for this browser" onChange={(value) => update("apiKey", value)} />
              <SettingsInput label="Base URL" value={settings.baseUrl} placeholder={settings.provider === "openai" ? "Optional: https://api.openai.com/v1" : "https://provider.example.com/v1"} onChange={(value) => update("baseUrl", value)} />
              <SettingsInput label="Model" value={settings.model} placeholder="minimax-m2.7" onChange={(value) => update("model", value)} />
            </SettingsGroup>

            <SettingsGroup icon={Link2} label="[ LIVE DATA ]" title="Toronto data">
              <SettingsInput label="Toronto Open Data token" value={settings.torontoToken} type={showSecrets ? "text" : "password"} placeholder="Optional app token" onChange={(value) => update("torontoToken", value)} />
              <SettingsInput label="Default city" value={settings.defaultCity} placeholder="Toronto" onChange={(value) => update("defaultCity", value)} />
              <SettingsToggle label="Use live data when available" checked={settings.useLiveData} onChange={(checked) => update("useLiveData", checked)} />
              <SettingsToggle label="Save chat history on this device" checked={settings.saveChatHistory} onChange={(checked) => update("saveChatHistory", checked)} />
              <SettingsToggle label="Share anonymous proposal votes" checked={settings.shareAnonymousVotes} onChange={(checked) => update("shareAnonymousVotes", checked)} />
            </SettingsGroup>
          </section>

          <aside className="space-y-4">
            <section className="terminal-panel p-4">
              <p className="terminal-label">[ LOCAL CONFIG ]</p>
              <div className="mt-4 flex items-end gap-2">
                <span className="text-5xl font-bold tabular-nums text-[var(--color-accent)]">{loaded ? readiness : 0}%</span>
                <span className="pb-2 text-xs uppercase tracking-widest text-[var(--color-text-mute)]">READY</span>
              </div>
              <div className="mt-4 h-2 border border-[var(--color-border)] bg-black">
                <div className="h-full bg-[var(--color-accent)] transition-all" style={{ width: `${loaded ? readiness : 0}%` }} />
              </div>
              <StatusNotice status={status} />
            </section>

            <section className="terminal-panel p-4">
              <p className="terminal-label">[ EXPORT ENV ]</p>
              <p className="mt-3 text-xs uppercase leading-6 tracking-wider text-[var(--color-text-dim)]">
                Browser Settings are for local demos. Put production secrets in Vercel environment variables.
              </p>
              <div className="mt-4 grid gap-2">
                <ActionButton tone="primary" onClick={saveSettings} icon={Save}>[ SAVE ]</ActionButton>
                <ActionButton onClick={testAi} icon={ShieldCheck}>{testing ? "[ TESTING ]" : "[ TEST AI ]"}</ActionButton>
                <ActionButton onClick={copyEnvTemplate} icon={Clipboard}>[ COPY ENV ]</ActionButton>
                <ActionButton onClick={() => setSettings(defaultLocalSettings)} icon={RotateCcw}>[ RESET FORM ]</ActionButton>
                <ActionButton tone="danger" onClick={clearSettings} icon={Trash2}>[ CLEAR SAVED ]</ActionButton>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function SettingsGroup({ icon: Icon, label, title, children }: { icon: React.ElementType; label: string; title: string; children: React.ReactNode }) {
  return (
    <section className="terminal-panel p-4">
      <div className="flex items-start gap-3 border-b border-[var(--color-border)] pb-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-[var(--color-accent)] text-[var(--color-accent)]">
          <Icon size={18} aria-hidden="true" />
        </span>
        <div>
          <p className="terminal-label">{label}</p>
          <h2 className="mt-1 text-lg font-bold uppercase tracking-tight text-[var(--color-text)]">{title}</h2>
        </div>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

function SettingsInput({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; type?: string }) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-text-mute)]">{label}</span>
      <input value={value} type={type} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className="mt-2 h-11 w-full border border-[var(--color-border)] bg-black px-3 text-xs uppercase tracking-wide text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-mute)] focus:border-[var(--color-accent)]" />
    </label>
  );
}

function SettingsSelect({ label, value, onChange, children }: { label: string; value: string; onChange: (value: string) => void; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-text-mute)]">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-11 w-full border border-[var(--color-border)] bg-black px-3 text-xs uppercase tracking-wide text-[var(--color-text)] outline-none focus:border-[var(--color-accent)]">
        {children}
      </select>
    </label>
  );
}

function SettingsToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex min-h-11 items-center justify-between gap-3 border border-[var(--color-border)] bg-black px-3">
      <span className="text-xs font-bold uppercase tracking-wide text-[var(--color-text-dim)]">{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4 accent-[var(--color-accent)]" />
    </label>
  );
}

function ActionButton({ children, icon: Icon, onClick, tone = "default" }: { children: React.ReactNode; icon: React.ElementType; onClick: () => void; tone?: "default" | "primary" | "danger" }) {
  const styles = {
    default: "border-[var(--color-border-strong)] text-[var(--color-text-dim)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]",
    primary: "border-[var(--color-accent)] bg-[var(--color-accent)] text-black hover:bg-[var(--color-accent-dim)]",
    danger: "border-[var(--color-bad)] text-[var(--color-bad)] hover:bg-[rgba(248,113,113,0.12)]"
  };

  return (
    <button type="button" onClick={onClick} className={`inline-flex w-full items-center justify-center gap-2 border px-4 py-2 text-xs font-bold uppercase tracking-widest transition ${styles[tone]}`}>
      <Icon size={15} aria-hidden="true" />
      {children}
    </button>
  );
}

function StatusNotice({ status }: { status: ConnectionStatus }) {
  const messages: Record<ConnectionStatus, { text: string; tone: string }> = {
    idle: { text: "[ IDLE ] No recent test.", tone: "text-[var(--color-text-mute)]" },
    saved: { text: "[ SAVED ] Local settings stored in this browser.", tone: "text-[var(--color-accent)]" },
    missing: { text: "[ MISSING ] Add an API key and base URL first.", tone: "text-[var(--color-warn)]" },
    "ai-ready": { text: "[ AI READY ] Provider returned a real answer.", tone: "text-[var(--color-accent)]" },
    fallback: { text: "[ BUILT-IN FALLBACK ] App still works without provider access.", tone: "text-[var(--color-warn)]" },
    copied: { text: "[ COPIED ] Environment template copied.", tone: "text-[var(--color-accent)]" },
    cleared: { text: "[ CLEARED ] Saved browser config removed.", tone: "text-[var(--color-bad)]" }
  };

  return (
    <p className={`mt-4 flex items-start gap-2 border border-[var(--color-border)] bg-black p-3 text-xs uppercase leading-5 tracking-wider ${messages[status].tone}`}>
      <Check size={14} aria-hidden="true" />
      {messages[status].text}
    </p>
  );
}
