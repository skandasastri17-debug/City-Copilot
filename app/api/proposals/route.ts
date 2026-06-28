import { NextResponse } from "next/server";
import { searchCivicProposals } from "@/lib/liveCivic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") ?? undefined;
  const proposals = await searchCivicProposals(query);

  return NextResponse.json({ proposals, source: proposals.some((proposal) => proposal.id.startsWith("live-")) ? "Live" : "Demo fallback" });
}
