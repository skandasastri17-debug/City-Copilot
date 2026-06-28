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

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Ask a clear civic question." }, { status: 400 });
  }

  const query = parsed.data.query;
  const classification = classifyRequest(query);
  const liveData = await searchLiveData({ query, category: classification.category, limit: 5 });
  const model = parsed.data.model || process.env.AI_MODEL || process.env.NVIDIA_MODEL || process.env.OPENAI_MODEL || NEMOTRON_MODEL;
  const provider = model.toLowerCase().includes("nemotron") ? "nvidia" : "openai";
  const apiKey =
    provider === "nvidia"
      ? process.env.NVIDIA_API_KEY || process.env.AI_API_KEY || process.env.OPENAI_API_KEY || parsed.data.openaiKey
      : process.env.OPENAI_API_KEY || process.env.AI_API_KEY || parsed.data.openaiKey;
  const baseUrl =
    process.env.AI_BASE_URL ||
    process.env.NVIDIA_API_BASE_URL ||
    (provider === "nvidia" ? NVIDIA_BASE_URL : OPENAI_BASE_URL);

  if (!apiKey) {
    return NextResponse.json({
      mode: "rules",
      answer: fallbackAnswer(query, classification.report.department, classification.report.nextStep),
      classification,
      liveData
    });
  }

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
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

    if (!response.ok) throw new Error(`OpenAI returned ${response.status}`);

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    return NextResponse.json({
      mode: "ai",
      provider,
      model,
      answer: payload.choices?.[0]?.message?.content ?? fallbackAnswer(query, classification.report.department, classification.report.nextStep),
      classification,
      liveData
    });
  } catch {
    return NextResponse.json({
      mode: "rules",
      answer: fallbackAnswer(query, classification.report.department, classification.report.nextStep),
      classification,
      liveData,
      warning: `${provider} provider unavailable; returned the reliable built-in answer.`
    });
  }
}

function fallbackAnswer(_query: string, department: string, nextStep: string) {
  return [
    `Answer: Start with ${department}.`,
    "",
    `Next: ${nextStep}`
  ].join("\n");
}
