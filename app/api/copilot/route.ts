import { NextResponse } from "next/server";
import { z } from "zod";
import { classifyRequest } from "@/lib/city";
import { searchLiveData } from "@/lib/liveData";

const requestSchema = z.object({
  query: z.string().min(2).max(1200),
  openaiKey: z.string().optional(),
  model: z.string().optional()
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Ask a clear civic question." }, { status: 400 });
  }

  const query = parsed.data.query;
  const classification = classifyRequest(query);
  const liveData = await searchLiveData({ query, category: classification.category, limit: 5 });
  const apiKey = process.env.OPENAI_API_KEY || parsed.data.openaiKey;

  if (!apiKey) {
    return NextResponse.json({
      mode: "rules",
      answer: fallbackAnswer(query, classification.report.department, classification.report.nextStep),
      classification,
      liveData
    });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: parsed.data.model || process.env.OPENAI_MODEL || "gpt-4.1-mini",
        temperature: 0.2,
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
      warning: "AI provider unavailable; returned the reliable rules-based answer."
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
