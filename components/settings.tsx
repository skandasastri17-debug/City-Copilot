"use client";

import { Check, Clipboard, Download, Eye, EyeOff, KeyRound, Link2, RotateCcw, Save, Settings2, ShieldCheck, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type ConnectionStatus = "idle" | "saved" | "missing" | "ready" | "copied" | "exported" | "cleared";

type ApiSettings = {
  openaiKey: string;
  openaiModel: string;
  torontoToken: string;
  mapKey: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  webhookUrl: string;
  defaultCity: string;
  useLiveData: boolean;
  saveChatHistory: boolean;
  shareAnonymousVotes: boolean;
};

const STORAGE_KEY = "city-copilot-settings";

const defaultSettings: ApiSettings = {
  openaiKey: "",
  openaiModel: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning-bf16",
  torontoToken: "",
  mapKey: "",
  supabaseUrl: "",
  supabaseAnonKey: "",
  webhookUrl: "",
  defaultCity: "Toronto",
  useLiveData: true,
  saveChatHistory: true,
  shareAnonymousVotes: false
};

export function SettingsWorkspace() {
  const [settings, setSettings] = useState<ApiSettings>(defaultSettings);
  const [showSecrets, setShowSecrets] = useState(false);
  const [status, setStatus] = useState<ConnectionStatus>("idle");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(saved) });
      } catch {
        setSettings(defaultSettings);
      }
    }
    setLoaded(true);
  }, []);

  const readiness = useMemo(() => {
    const checks = [
      Boolean(settings.openaiKey.trim()),
      Boolean(settings.torontoToken.trim()) || settings.useLiveData,
      Boolean(settings.defaultCity.trim())
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [settings]);

  function update<K extends keyof ApiSettings>(key: K, value: ApiSettings[K]) {
    setSettings((current) => ({ ...current, [key]: value }));
    setStatus("idle");
  }

  function saveSettings() {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setStatus("saved");
  }

  function clearSettings() {
    window.localStorage.removeItem(STORAGE_KEY);
    setSettings(defaultSettings);
    setStatus("cleared");
  }

  function testConnection() {
    setStatus(settings.openaiKey.trim() || settings.useLiveData ? "ready" : "missing");
  }

  async function copyEnvTemplate() {
    const template = [
      `NVIDIA_API_KEY=${settings.openaiKey || "replace-with-your-nvidia-key"}`,
      `AI_MODEL=${settings.openaiModel}`,
      `AI_BASE_URL=https://integrate.api.nvidia.com/v1`,
      `TORONTO_OPEN_DATA_APP_TOKEN=${settings.torontoToken || "optional"}`,
      `NEXT_PUBLIC_MAP_KEY=${settings.mapKey || "optional"}`,
      `NEXT_PUBLIC_SUPABASE_URL=${settings.supabaseUrl || "optional"}`,
      `NEXT_PUBLIC_SUPABASE_ANON_KEY=${settings.supabaseAnonKey || "optional"}`,
      `CITY_COPILOT_WEBHOOK_URL=${settings.webhookUrl || "optional"}`
    ].join("\n");

    await window.navigator.clipboard.writeText(template);
    setStatus("copied");
  }

  function exportSettings() {
    const safeSettings = { ...settings, openaiKey: mask(settings.openaiKey), supabaseAnonKey: mask(settings.supabaseAnonKey), torontoToken: mask(settings.torontoToken), mapKey: mask(settings.mapKey) };
    const blob = new Blob([JSON.stringify(safeSettings, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "city-copilot-settings.json";
    link.click();
    URL.revokeObjectURL(url);
    setStatus("exported");
  }

  return (
    <main className="toronto-chat-canvas min-h-[calc(100vh-57px)] bg-black px-4 py-8 text-white lg:min-h-screen lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <section className="rounded-[28px] border border-white/10 bg-[#111] shadow-[0_24px_90px_rgba(0,0,0,0.34)]">
            <div className="border-b border-white/10 p-6">
              <p className="font-utility text-[11px] font-bold uppercase tracking-[0.18em] text-[#55c7d9]">Control room</p>
              <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-black tracking-[-0.03em] text-white">Settings</h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">
                    Add API keys and city defaults for live data, AI answers, maps, storage, and civic actions.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSecrets((visible) => !visible)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white/78 transition hover:bg-white/10"
                >
                  {showSecrets ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
                  {showSecrets ? "Hide keys" : "Show keys"}
                </button>
              </div>
            </div>

            <div className="grid gap-5 p-6">
              <SettingsGroup icon={KeyRound} title="AI provider" description="Connect an OpenAI-compatible provider for short Copilot answers.">
                <SettingsInput label="AI API key" value={settings.openaiKey} type={showSecrets ? "text" : "password"} placeholder="NVIDIA, OpenAI, or compatible key" onChange={(value) => update("openaiKey", value)} />
                <SettingsSelect label="Model" value={settings.openaiModel} onChange={(value) => update("openaiModel", value)}>
                  <option value="nvidia/nemotron-3-nano-omni-30b-a3b-reasoning-bf16">Nemotron-3-Nano-Omni-30B-A3B-Reasoning-BF16</option>
                  <option value="gpt-4.1-mini">gpt-4.1-mini</option>
                  <option value="gpt-4.1">gpt-4.1</option>
                  <option value="gpt-4o-mini">gpt-4o-mini</option>
                </SettingsSelect>
              </SettingsGroup>

              <SettingsGroup icon={Link2} title="Live civic data" description="Connect Toronto Open Data, maps, database storage, and optional automations.">
                <SettingsInput label="Toronto Open Data app token" value={settings.torontoToken} type={showSecrets ? "text" : "password"} placeholder="Optional CKAN token" onChange={(value) => update("torontoToken", value)} />
                <SettingsInput label="Map API key" value={settings.mapKey} type={showSecrets ? "text" : "password"} placeholder="Mapbox, MapLibre, or provider key" onChange={(value) => update("mapKey", value)} />
                <SettingsInput label="Supabase URL" value={settings.supabaseUrl} placeholder="https://project.supabase.co" onChange={(value) => update("supabaseUrl", value)} />
                <SettingsInput label="Supabase anon key" value={settings.supabaseAnonKey} type={showSecrets ? "text" : "password"} placeholder="ey..." onChange={(value) => update("supabaseAnonKey", value)} />
                <SettingsInput label="Webhook URL" value={settings.webhookUrl} placeholder="Optional civic action webhook" onChange={(value) => update("webhookUrl", value)} />
              </SettingsGroup>

              <SettingsGroup icon={Settings2} title="App behavior" description="Choose the defaults that shape how City Copilot behaves for this browser.">
                <SettingsInput label="Default city" value={settings.defaultCity} placeholder="Toronto" onChange={(value) => update("defaultCity", value)} />
                <SettingsToggle label="Use live data when available" checked={settings.useLiveData} onChange={(checked) => update("useLiveData", checked)} />
                <SettingsToggle label="Save chat history on this device" checked={settings.saveChatHistory} onChange={(checked) => update("saveChatHistory", checked)} />
                <SettingsToggle label="Share anonymous proposal votes" checked={settings.shareAnonymousVotes} onChange={(checked) => update("shareAnonymousVotes", checked)} />
              </SettingsGroup>
            </div>

            <div className="flex flex-wrap gap-3 border-t border-white/10 p-6">
              <ActionButton tone="primary" onClick={saveSettings} icon={Save}>
                Save settings
              </ActionButton>
              <ActionButton onClick={testConnection} icon={ShieldCheck}>
                Check readiness
              </ActionButton>
              <ActionButton onClick={copyEnvTemplate} icon={Clipboard}>
                Copy env template
              </ActionButton>
              <ActionButton onClick={exportSettings} icon={Download}>
                Export safe JSON
              </ActionButton>
              <ActionButton tone="danger" onClick={clearSettings} icon={Trash2}>
                Clear
              </ActionButton>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-[28px] border border-white/10 bg-[#111] p-5">
              <p className="font-utility text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">Setup progress</p>
              <div className="mt-5 flex items-end gap-2">
                <span className="text-5xl font-black tracking-[-0.05em] text-white">{loaded ? readiness : 0}%</span>
                <span className="pb-2 text-sm font-bold text-white/45">ready</span>
              </div>
              <div className="mt-5 h-2 rounded-full bg-white/10">
                <div className="h-2 rounded-full bg-[#da291c] transition-all" style={{ width: `${loaded ? readiness : 0}%` }} />
              </div>
              <StatusNotice status={status} />
            </div>

            <div className="rounded-[28px] border border-[#55c7d9]/20 bg-[#55c7d9]/10 p-5">
              <h2 className="text-lg font-black tracking-[-0.02em] text-white">Key storage note</h2>
              <p className="mt-2 text-sm leading-6 text-white/62">
                These settings are saved only in this browser for the MVP. For a public production app, put secret keys in Vercel environment variables and call them from server routes.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSettings(defaultSettings)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white/72 transition hover:bg-white/10"
            >
              <RotateCcw size={17} aria-hidden="true" />
              Reset form values
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}

function SettingsGroup({ icon: Icon, title, description, children }: { icon: React.ElementType; title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[24px] border border-white/10 bg-white/[0.035] p-5">
      <div className="flex gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#da291c] text-white">
          <Icon size={18} aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-lg font-black tracking-[-0.02em] text-white">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-white/50">{description}</p>
        </div>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

function SettingsInput({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; type?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-[0.12em] text-white/46">{label}</span>
      <input
        value={value}
        type={type}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-black/35 px-4 text-sm font-semibold text-white outline-none placeholder:text-white/26 focus:border-[#55c7d9]/60"
      />
    </label>
  );
}

function SettingsSelect({ label, value, onChange, children }: { label: string; value: string; onChange: (value: string) => void; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-[0.12em] text-white/46">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-black/35 px-4 text-sm font-semibold text-white outline-none focus:border-[#55c7d9]/60">
        {children}
      </select>
    </label>
  );
}

function SettingsToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex min-h-12 items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/25 px-4">
      <span className="text-sm font-bold text-white/76">{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-5 w-5 accent-[#da291c]" />
    </label>
  );
}

function ActionButton({ children, icon: Icon, onClick, tone = "default" }: { children: React.ReactNode; icon: React.ElementType; onClick: () => void; tone?: "default" | "primary" | "danger" }) {
  const styles = {
    default: "border-white/10 bg-white/5 text-white/78 hover:bg-white/10",
    primary: "border-[#da291c] bg-[#da291c] text-white hover:bg-[#bf2419]",
    danger: "border-[#da291c]/30 bg-[#da291c]/10 text-white hover:bg-[#da291c]/18"
  };

  return (
    <button type="button" onClick={onClick} className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-black transition ${styles[tone]}`}>
      <Icon size={17} aria-hidden="true" />
      {children}
    </button>
  );
}

function StatusNotice({ status }: { status: ConnectionStatus }) {
  const messages: Record<ConnectionStatus, string> = {
    idle: "No recent changes saved.",
    saved: "Settings saved on this device.",
    missing: "Add an API key or keep live data enabled before connecting.",
    ready: "Ready for live data and AI integration.",
    copied: "Environment template copied.",
    exported: "Safe settings file exported.",
    cleared: "Settings cleared."
  };

  return (
    <p className="mt-4 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm font-bold text-white/62">
      <Check size={16} aria-hidden="true" />
      {messages[status]}
    </p>
  );
}

function mask(value: string) {
  if (!value) return "";
  if (value.length <= 8) return "********";
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}
