import { hashString, legacyToDna, nearestNeighborhood, proposals, scoreAxes, scoreFromDna, type CivicProposal, type LegacyAxis, type NeighborhoodProfile } from "@/lib/civicPlatform";

type GeocodeResult = {
  displayName: string;
  lat: number;
  lon: number;
};

type OpenDataLead = {
  title: string;
  description: string;
  source: string;
  url?: string;
};

const TORONTO_OPEN_DATA_API =
  process.env.TORONTO_OPEN_DATA_API_BASE ?? "https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action";

const NOMINATIM_API = process.env.NOMINATIM_API_BASE ?? "https://nominatim.openstreetmap.org";

export async function buildNeighborhoodReport(address: string): Promise<NeighborhoodProfile> {
  const fallback = nearestNeighborhood(address);

  try {
    const [geocode, leads] = await Promise.all([
      geocodeToronto(address),
      searchOpenData(`${address} Toronto transit parks housing safety development`, 5)
    ]);

    return synthesizeProfile(address, fallback, geocode, leads);
  } catch {
    return {
      ...fallback,
      source: "Demo fallback",
      liveLeads: []
    };
  }
}

export async function searchCivicProposals(query = "council agenda Toronto planning transportation parks"): Promise<CivicProposal[]> {
  try {
    const leads = await searchOpenData(query, 4);
    const liveCards = leads.map((lead, index): CivicProposal => {
      const base = proposals[index % proposals.length];
      return {
        ...base,
        id: `live-${index}-${slug(lead.title)}`,
        title: lead.title,
        summary: lead.description,
        category: inferCategory(lead.title),
        area: query.toLowerCase().includes("toronto") ? "Toronto" : base.area,
        link: lead.url ?? base.link,
        civicAction: "Review the source and decide whether to send feedback, attend a meeting, or track the issue.",
        emailTemplate: `Hello,\n\nI am writing about ${lead.title}.\n\nI would like the city to consider resident impact, equity, safety, and long-term livability before making a decision.\n\nThank you.`
      };
    });

    return liveCards.length ? liveCards : proposals;
  } catch {
    return proposals;
  }
}

async function geocodeToronto(address: string): Promise<GeocodeResult> {
  const url = new URL(`${NOMINATIM_API}/search`);
  url.searchParams.set("q", `${address}, Toronto, Ontario, Canada`);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "1");
  url.searchParams.set("addressdetails", "1");

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "CityCopilotHackathon/1.0"
    },
    next: { revalidate: 60 * 60 * 24 }
  });

  if (!response.ok) throw new Error(`Geocoding failed: ${response.status}`);

  const payload = (await response.json()) as Array<{
    display_name?: string;
    lat?: string;
    lon?: string;
  }>;
  const first = payload[0];

  if (!first?.lat || !first.lon) throw new Error("No Toronto geocode match");

  return {
    displayName: first.display_name ?? address,
    lat: Number(first.lat),
    lon: Number(first.lon)
  };
}

async function searchOpenData(query: string, limit: number): Promise<OpenDataLead[]> {
  const url = new URL(`${TORONTO_OPEN_DATA_API}/package_search`);
  url.searchParams.set("q", query);
  url.searchParams.set("rows", String(limit));

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 * 30 }
  });

  if (!response.ok) throw new Error(`Toronto Open Data failed: ${response.status}`);

  const payload = (await response.json()) as {
    success?: boolean;
    result?: {
      results?: Array<{
        title?: string;
        name?: string;
        notes?: string;
      }>;
    };
  };

  if (!payload.success) throw new Error("Toronto Open Data search failed");

  return (payload.result?.results ?? []).map((item) => ({
    title: item.title ?? item.name ?? "Toronto Open Data dataset",
    description: summarize(item.notes ?? "Toronto Open Data resource related to this civic question."),
    source: "Toronto Open Data",
    url: item.name ? `https://open.toronto.ca/dataset/${item.name}/` : "https://open.toronto.ca/"
  }));
}

function synthesizeProfile(address: string, fallback: NeighborhoodProfile, geocode: GeocodeResult, leads: OpenDataLead[]): NeighborhoodProfile {
  const seed = Math.abs(hashString(`${address}-${geocode.lat}-${geocode.lon}`));
  const axes = scoreAxes.reduce(
    (next, axis, index) => ({
      ...next,
      [axis]: clamp(fallback.axes[axis] + ((seed >> (index + 1)) % 15) - 7 + leadBoost(axis, leads))
    }),
    {} as Record<LegacyAxis, number>
  );
  const dna = legacyToDna(axes, seed);
  const score = scoreFromDna(dna);

  return {
    ...fallback,
    id: `live-${slug(address)}`,
    name: shortName(address, geocode.displayName),
    addressHint: geocode.displayName,
    score,
    rank: percentileLabel(score),
    trend: score >= fallback.score + 3 ? "Improving" : score <= fallback.score - 3 ? "Watch" : "Stable",
    axes,
    dna,
    summary: `Live civic read for ${shortName(address, geocode.displayName)} using geocoding plus Toronto Open Data leads. ${fallback.summary}`,
    signals: [
      `Matched location at ${geocode.lat.toFixed(4)}, ${geocode.lon.toFixed(4)}.`,
      leads[0] ? `Most relevant open dataset: ${leads[0].title}.` : "No highly specific Toronto Open Data dataset was returned.",
      ...fallback.signals.slice(0, 1)
    ],
    forecast: fallback.forecast.map((value, index) => clamp(Math.round((value + score) / 2 + index))),
    counts: {
      ...fallback.counts,
      permits: clamp(fallback.counts.permits + ((seed >> 3) % 8) - 3),
      complaints: clamp(fallback.counts.complaints + ((seed >> 4) % 8) - 3)
    },
    coords: { lat: geocode.lat, lon: geocode.lon },
    source: "Live",
    liveLeads: leads
  };
}

function leadBoost(axis: LegacyAxis, leads: OpenDataLead[]) {
  const terms: Record<LegacyAxis, string[]> = {
    Transit: ["transit", "ttc", "traffic", "cycling"],
    Services: ["service", "library", "community", "program"],
    Housing: ["housing", "shelter", "development"],
    "Green space": ["park", "tree", "environment", "green"],
    Safety: ["safety", "collision", "traffic", "police"],
    Development: ["building", "permit", "development", "planning"]
  };
  const haystack = leads.map((lead) => `${lead.title} ${lead.description}`).join(" ").toLowerCase();
  return terms[axis].some((term) => haystack.includes(term)) ? 4 : 0;
}

function inferCategory(title: string) {
  const lower = title.toLowerCase();
  if (lower.includes("park") || lower.includes("tree")) return "Parks";
  if (lower.includes("transit") || lower.includes("traffic") || lower.includes("cycling")) return "Transit";
  if (lower.includes("housing") || lower.includes("shelter")) return "Housing";
  if (lower.includes("safety") || lower.includes("collision")) return "Safety";
  return "City decision";
}

function summarize(text: string) {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > 220 ? `${clean.slice(0, 217)}...` : clean;
}

function shortName(address: string, displayName: string) {
  return address.trim() || displayName.split(",")[0] || "Toronto place";
}

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "toronto";
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, value));
}

function percentileLabel(score: number) {
  if (score >= 85) return "Top 10%";
  if (score >= 78) return "Top 20%";
  if (score >= 70) return "Top 35%";
  if (score >= 62) return "Middle 50%";
  return "Needs attention";
}
