import { NextResponse } from "next/server";
import { z } from "zod";
import { classifyRequest } from "@/lib/city";
import { searchLiveData } from "@/lib/liveData";

const requestSchema = z.object({
  query: z.string().min(2).max(1200),
  provider: z.enum(["vultr", "openai", "compatible"]).optional(),
  apiKey: z.string().optional(),
  baseUrl: z.string().optional(),
  openaiKey: z.string().optional(),
  model: z.string().optional()
});

const NEMOTRON_MODEL = "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning-bf16";
const NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1";
const OPENAI_BASE_URL = "https://api.openai.com/v1";
const DEFAULT_VULTR_MODEL = "minimax-m2.7";

type AiCivicAnswer = {
  title: string;
  answer: string;
  department: string;
  category: string;
  priority: string;
  nextStep: string;
  locationNeeded: string;
  cleanDescription: string;
  actions: string[];
  emailDraft: {
    to: string;
    subject: string;
    body: string;
  };
};

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Ask a clear civic question." }, { status: 400 });
  }

  const query = parsed.data.query;
  const classification = classifyRequest(query);
  const liveData = await searchLiveData({ query, category: classification.category, limit: 5 });
  const config = resolveProvider({
    provider: parsed.data.provider,
    apiKey: parsed.data.apiKey,
    baseUrl: parsed.data.baseUrl,
    model: parsed.data.model,
    legacyOpenAiKey: parsed.data.openaiKey
  });

  if (!config) {
    return NextResponse.json({
      mode: "rules",
      answer: fallbackAnswer(query, classification.report.department, classification.report.nextStep),
      civicAnswer: fallbackCivicAnswer(query, classification),
      classification,
      liveData
    });
  }

  try {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model,
        temperature: 0.2,
        max_tokens: 220,
        messages: [
          {
            role: "system",
            content:
              "You are City Copilot, a Toronto civic assistant. Return ONLY valid JSON with keys: title, answer, department, category, priority, nextStep, locationNeeded, cleanDescription, actions, emailDraft. actions must be 2-4 short strings. emailDraft must have to, subject, body. Use the resident's actual request. If they ask for a program like coding classes, route to the best city/library/community department and draft a polite email asking for details. Do not pretend to file official reports."
          },
          {
            role: "user",
            content: JSON.stringify({
              residentQuestion: query,
              classification: {
                category: classification.category,
                priority: classification.report.priority,
                department: classification.report.department,
                estimatedResponseTime: classification.report.estimatedResponseTime,
                nextStep: classification.report.nextStep
              },
              liveDataLeads: liveData.leads.map((lead) => ({
                title: lead.title,
                source: lead.source,
                description: lead.description
              }))
            })
          }
        ]
      })
    });

    if (!response.ok) {
      const message = await response.text().catch(() => "");
      throw new Error(`${config.provider} returned ${response.status}: ${message.slice(0, 180)}`);
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = payload.choices?.[0]?.message?.content ?? "";
    const parsedCivicAnswer = parseAiCivicAnswer(content);
    const civicAnswer = parsedCivicAnswer ?? fallbackCivicAnswer(query, classification);

    return NextResponse.json({
      mode: parsedCivicAnswer ? "ai" : "rules",
      provider: config.provider,
      model: config.model,
      answer: civicAnswer.answer,
      civicAnswer,
      classification,
      liveData
    });
  } catch {
    return NextResponse.json({
      mode: "rules",
      provider: config.provider,
      model: config.model,
      answer: fallbackAnswer(query, classification.report.department, classification.report.nextStep),
      civicAnswer: fallbackCivicAnswer(query, classification),
      classification,
      liveData,
      warning: "AI provider unavailable; returned the reliable built-in answer."
    });
  }
}

function parseAiCivicAnswer(content: string): AiCivicAnswer | null {
  const cleaned = content.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  const json = start >= 0 && end > start ? cleaned.slice(start, end + 1) : cleaned;
  try {
    const parsed = JSON.parse(json) as Partial<AiCivicAnswer>;
    if (!parsed.answer || !parsed.department || !parsed.emailDraft?.body) return null;
    return {
      title: clean(parsed.title) || "City Copilot response",
      answer: clean(parsed.answer),
      department: clean(parsed.department),
      category: clean(parsed.category) || "City service",
      priority: clean(parsed.priority) || "Normal",
      nextStep: clean(parsed.nextStep) || "Contact the department with the details below.",
      locationNeeded: clean(parsed.locationNeeded) || "Add a Toronto address, intersection, or program area if relevant.",
      cleanDescription: clean(parsed.cleanDescription) || "Resident request needs review.",
      actions: Array.isArray(parsed.actions) && parsed.actions.length ? parsed.actions.slice(0, 4).map(clean).filter(Boolean) : ["Contact the department", "Save this draft"],
      emailDraft: {
        to: clean(parsed.emailDraft.to) || clean(parsed.department),
        subject: clean(parsed.emailDraft.subject) || "City Copilot request",
        body: clean(parsed.emailDraft.body)
      }
    };
  } catch {
    return null;
  }
}

function fallbackCivicAnswer(query: string, classification: ReturnType<typeof classifyRequest>): AiCivicAnswer {
  return {
    title: classification.report.title,
    answer: fallbackAnswer(query, classification.report.department, classification.report.nextStep),
    department: classification.report.department,
    category: classification.category,
    priority: classification.report.priority,
    nextStep: classification.report.nextStep,
    locationNeeded: classification.report.location,
    cleanDescription: classification.report.description,
    actions: classification.suggestedActions.slice(0, 4),
    emailDraft: {
      to: classification.report.department,
      subject: classification.report.title,
      body: [
        `Hello ${classification.report.department},`,
        "",
        classification.report.description,
        "",
        `Recommended next step: ${classification.report.nextStep}`,
        "",
        "Thank you."
      ].join("\n")
    }
  };
}

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function resolveProvider(clientConfig: { provider?: "vultr" | "openai" | "compatible"; apiKey?: string; baseUrl?: string; model?: string; legacyOpenAiKey?: string }) {
  const clientKey = clientConfig.apiKey?.trim();
  const clientBase = clientConfig.baseUrl?.trim();
  const requestedModel = clientConfig.model?.trim();

  if (clientKey && clientConfig.provider === "openai") {
    return {
      provider: "openai",
      apiKey: clientKey,
      baseUrl: stripSlash(clientBase || OPENAI_BASE_URL),
      model: requestedModel || "gpt-4.1-mini"
    };
  }

  if (clientKey && clientBase) {
    return {
      provider: clientConfig.provider ?? "compatible",
      apiKey: clientKey,
      baseUrl: stripSlash(clientBase),
      model: requestedModel || (clientConfig.provider === "vultr" ? DEFAULT_VULTR_MODEL : "gpt-4.1-mini")
    };
  }

  const vultrKey = process.env.VULTR_API_KEY;
  const vultrBase = process.env.VULTR_API_BASE_URL;
  if (vultrKey && vultrBase) {
    return {
      provider: "vultr",
      apiKey: vultrKey,
      baseUrl: stripSlash(vultrBase),
      model: requestedModel || process.env.VULTR_MODEL || DEFAULT_VULTR_MODEL
    };
  }

  const aiKey = process.env.AI_API_KEY || process.env.NVIDIA_API_KEY;
  const aiBase = process.env.AI_BASE_URL || process.env.NVIDIA_API_BASE_URL;
  if (aiKey && aiBase) {
    const model = requestedModel || process.env.AI_MODEL || process.env.NVIDIA_MODEL || NEMOTRON_MODEL;
    return {
      provider: model.toLowerCase().includes("nemotron") ? "nvidia" : "compatible",
      apiKey: aiKey,
      baseUrl: stripSlash(aiBase),
      model
    };
  }

  const openAiKey = process.env.OPENAI_API_KEY || clientConfig.legacyOpenAiKey;
  if (openAiKey) {
    return {
      provider: "openai",
      apiKey: openAiKey,
      baseUrl: OPENAI_BASE_URL,
      model: requestedModel || process.env.OPENAI_MODEL || "gpt-4.1-mini"
    };
  }

  return null;
}

function stripSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function fallbackAnswer(_query: string, department: string, nextStep: string) {
  return [
    `Answer: Start with ${department}.`,
    "",
    `Next: ${nextStep}`
  ].join("\n");
}
