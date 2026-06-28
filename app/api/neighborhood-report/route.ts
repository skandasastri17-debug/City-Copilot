import { NextResponse } from "next/server";
import { z } from "zod";
import { buildNeighborhoodReport } from "@/lib/liveCivic";

const requestSchema = z.object({
  address: z.string().min(2).max(180)
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a Toronto address or place name." }, { status: 400 });
  }

  const report = await buildNeighborhoodReport(parsed.data.address);
  return NextResponse.json(report);
}
