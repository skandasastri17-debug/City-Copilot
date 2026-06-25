import { NextResponse } from "next/server";
import { z } from "zod";
import { searchLiveData } from "@/lib/liveData";

const requestSchema = z.object({
  query: z.string().min(1).max(500),
  category: z.enum([
    "Infrastructure",
    "Safety",
    "Transit",
    "Environment",
    "Community Services",
    "Housing",
    "Parks & Recreation",
    "Other"
  ])
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid live data search request" }, { status: 400 });
  }

  const result = await searchLiveData({
    query: parsed.data.query,
    category: parsed.data.category
  });

  return NextResponse.json(result);
}
