export type AiProvider = "vultr" | "openai" | "compatible";

export type LocalCopilotSettings = {
  provider: AiProvider;
  apiKey: string;
  baseUrl: string;
  model: string;
  torontoToken: string;
  defaultCity: string;
  useLiveData: boolean;
  saveChatHistory: boolean;
  shareAnonymousVotes: boolean;
};

export const LOCAL_SETTINGS_KEY = "city-copilot-settings";

export const defaultLocalSettings: LocalCopilotSettings = {
  provider: "vultr",
  apiKey: "",
  baseUrl: "",
  model: "minimax-m2.7",
  torontoToken: "",
  defaultCity: "Toronto",
  useLiveData: true,
  saveChatHistory: true,
  shareAnonymousVotes: false
};

export function normalizeLocalSettings(raw: unknown): LocalCopilotSettings {
  if (!raw || typeof raw !== "object") return defaultLocalSettings;

  const value = raw as Partial<LocalCopilotSettings> & {
    openaiKey?: string;
    openaiModel?: string;
    vultrBaseUrl?: string;
  };
  const provider = value.provider === "openai" || value.provider === "compatible" || value.provider === "vultr" ? value.provider : defaultLocalSettings.provider;

  return {
    provider,
    apiKey: value.apiKey ?? value.openaiKey ?? "",
    baseUrl: value.baseUrl ?? value.vultrBaseUrl ?? "",
    model: value.model ?? value.openaiModel ?? defaultLocalSettings.model,
    torontoToken: value.torontoToken ?? "",
    defaultCity: value.defaultCity ?? defaultLocalSettings.defaultCity,
    useLiveData: value.useLiveData ?? defaultLocalSettings.useLiveData,
    saveChatHistory: value.saveChatHistory ?? defaultLocalSettings.saveChatHistory,
    shareAnonymousVotes: value.shareAnonymousVotes ?? defaultLocalSettings.shareAnonymousVotes
  };
}

export function readLocalCopilotSettings(): LocalCopilotSettings {
  if (typeof window === "undefined") return defaultLocalSettings;

  try {
    const saved = window.localStorage.getItem(LOCAL_SETTINGS_KEY);
    return saved ? normalizeLocalSettings(JSON.parse(saved)) : defaultLocalSettings;
  } catch {
    return defaultLocalSettings;
  }
}

export function getCopilotRequestConfig(settings = readLocalCopilotSettings()) {
  return {
    provider: settings.provider,
    apiKey: settings.apiKey,
    baseUrl: settings.baseUrl,
    model: settings.model
  };
}
