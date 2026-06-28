import { NextResponse } from "next/server";
import { z } from "zod";
import { classifyRequest } from "@/lib/city";
import { searchLiveData } from "@/lib/liveData";

const requestSchema = z.object({
  query: z.string().min(2).max(1200),
  openaiKey: z.string().optional(),
  model: z.string().optional()
});

const NEMOTRON_MODEL = "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning-bf16";
const NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1";
const OPENAI_BASE_URL = "https://api.openai.com/v1";
const DEFAULT_VULTR_MODEL = "minimax-m2.7";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Ask a clear civic question." }, { status: 400 });
  }

  const query = parsed.data.query;
  const classification = classifyRequest(query);
  const liveData = await searchLiveData({ query, category: classification.category, limit: 5 });
  const config = resolveProvider(parsed.data.model, parsed.data.openaiKey);

  if (!config) {
    return NextResponse.json({
      mode: "rules",
      answer: fallbackAnswer(query, classification.report.department, classification.report.nextStep),
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
              "You are City Copilot, a Toronto civic assistant. Answer in 2-4 short lines. Use simple words. Tell the resident what to do next. Do not list datasets, sources, routing details, or internal classifications unless the user asks. Do not pretend to file official reports."
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

    return NextResponse.json({
      mode: "ai",
      provider: config.provider,
      model: config.model,
      answer: payload.choices?.[0]?.message?.content ?? fallbackAnswer(query, classification.report.department, classification.report.nextStep),
      classification,
      liveData
    });
  } catch {
    return NextResponse.json({
      mode: "rules",
      provider: config.provider,
      model: config.model,
      answer: fallbackAnswer(query, classification.report.department, classification.report.nextStep),
      classification,
      liveData,
      warning: "AI provider unavailable; returned the reliable built-in answer."
    });
  }
}

function resolveProvider(requestedModel?: string, clientKey?: string) {
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

  const openAiKey = process.env.OPENAI_API_KEY || clientKey;
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
