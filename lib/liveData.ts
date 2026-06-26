import { CityCategory, resources } from "@/lib/city";

export type LiveDataLead = {
  title: string;
  description: string;
  source: "Toronto Open Data" | "City Copilot resources";
  url?: string;
  formats?: string[];
};

export type LiveDataResult = {
  query: string;
  category: CityCategory;
  leads: LiveDataLead[];
  searchedAt: string;
  error?: string;
};

const TORONTO_OPEN_DATA_API =
  process.env.TORONTO_OPEN_DATA_API_BASE ?? "https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action";

const categorySearchTerms: Record<CityCategory, string[]> = {
  Infrastructure: ["311", "road", "water", "traffic", "sidewalk"],
  Safety: ["safety", "crosswalk", "traffic", "lighting"],
  Transit: ["ttc", "transit", "traffic", "cycling", "bike"],
  Environment: ["waste", "parks", "trees", "environment", "heat"],
  "Community Services": ["community services", "library", "recreation", "seniors", "youth"],
  Housing: ["shelter", "housing", "homelessness"],
  "Parks & Recreation": ["parks", "recreation", "facilities", "trees"],
  Other: ["311", "city services"]
};

export async function searchLiveData(params: {
  query: string;
  category: CityCategory;
  limit?: number;
}): Promise<LiveDataResult> {
  const limit = params.limit ?? 6;
  const localLeads = searchLocalResources(params.query, params.category, Math.ceil(limit / 2));

  try {
    const openDataLeads = await searchTorontoOpenData(params.query, params.category, limit - localLeads.length);

    return {
      query: params.query,
      category: params.category,
      leads: [...openDataLeads, ...localLeads].slice(0, limit),
      searchedAt: new Date().toISOString()
    };
  } catch (error) {
    return {
      query: params.query,
      category: params.category,
      leads: localLeads,
      searchedAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Live data search failed"
    };
  }
}

async function searchTorontoOpenData(query: string, category: CityCategory, limit: number): Promise<LiveDataLead[]> {
  if (limit <= 0) return [];

  const searchTerms = [...new Set([query, ...categorySearchTerms[category]])].join(" ");
  const url = new URL(`${TORONTO_OPEN_DATA_API}/package_search`);
  url.searchParams.set("q", searchTerms);
  url.searchParams.set("rows", String(limit));

  const response = await fetch(url, {
    headers: { Accept: "application/json" }
  });

  if (!response.ok) {
    throw new Error(`Toronto Open Data returned ${response.status}`);
  }

  const payload = (await response.json()) as {
    success?: boolean;
    result?: {
      results?: Array<{
        title?: string;
        name?: string;
        notes?: string;
        resources?: Array<{ format?: string }>;
      }>;
    };
  };

  if (!payload.success) {
    throw new Error("Toronto Open Data search was not successful");
  }

  return (payload.result?.results ?? []).map((item) => {
    const name = item.name ?? "";
    const formats = [...new Set((item.resources ?? []).map((resource) => resource.format).filter(Boolean) as string[])];

    return {
      title: item.title ?? name,
      description: summarize(item.notes ?? "Toronto Open Data dataset related to this request."),
      source: "Toronto Open Data",
      url: name ? `https://open.toronto.ca/dataset/${name}/` : "https://open.toronto.ca/",
      formats
    };
  });
}

function searchLocalResources(query: string, category: CityCategory, limit: number): LiveDataLead[] {
  const terms = `${query} ${category}`.toLowerCase().split(/\W+/).filter((term) => term.length > 2);

  return resources
    .map((resource) => {
      const haystack = `${resource.name} ${resource.category} ${resource.tags.join(" ")} ${resource.description} ${resource.eligibility}`.toLowerCase();
      const score = terms.reduce((total, term) => total + (haystack.includes(term) ? 1 : 0), 0);
      return { resource, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ resource }) => ({
      title: resource.name,
      description: resource.description,
      source: "City Copilot resources",
      url: resource.contact
    }));
}

function summarize(text: string) {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > 180 ? `${clean.slice(0, 177)}...` : clean;
}
