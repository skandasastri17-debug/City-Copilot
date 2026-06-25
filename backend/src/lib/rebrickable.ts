import {
  RebrickableColorSummary,
  RebrickablePartSummary,
  RebrickableSetPart,
  RebrickableSetSummary,
} from "../types.js";

const REBRICKABLE_API_BASE = "https://rebrickable.com/api/v3/lego";

export async function fetchRebrickableParts(
  partNums: string[],
  apiKey: string
): Promise<Map<string, RebrickablePartSummary>> {
  if (partNums.length === 0) {
    return new Map();
  }

  const url = new URL(`${REBRICKABLE_API_BASE}/parts/`);
  url.searchParams.set("part_nums", Array.from(new Set(partNums)).join(","));
  url.searchParams.set("inc_part_details", "1");
  url.searchParams.set("page_size", "1000");

  const response = await fetch(url, {
    headers: {
      Authorization: `key ${apiKey}`,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Rebrickable parts lookup failed: ${response.status} ${message}`);
  }

  const payload = (await response.json()) as {
    results?: RebrickablePartSummary[];
  };

  return new Map((payload.results ?? []).map((part) => [part.part_num, part]));
}

export async function fetchRebrickableColors(
  apiKey: string
): Promise<RebrickableColorSummary[]> {
  const url = new URL(`${REBRICKABLE_API_BASE}/colors/`);
  url.searchParams.set("page_size", "1000");

  const response = await fetch(url, {
    headers: {
      Authorization: `key ${apiKey}`,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Rebrickable colors lookup failed: ${response.status} ${message}`);
  }

  const payload = (await response.json()) as {
    results?: RebrickableColorSummary[];
  };

  return payload.results ?? [];
}

export function matchColorId(
  colorName: string,
  colors: RebrickableColorSummary[]
): RebrickableColorSummary | undefined {
  const normalized = normalize(colorName);
  const exact = colors.find((color) => normalize(color.name) === normalized);
  if (exact) {
    return exact;
  }

  return colors.find((color) => normalize(color.name).includes(normalized));
}

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ");
}

export async function fetchSetsForPartColor(
  partNum: string,
  colorId: number | undefined,
  apiKey: string
): Promise<RebrickableSetSummary[]> {
  if (!colorId) {
    return [];
  }

  const url = new URL(`${REBRICKABLE_API_BASE}/parts/${encodeURIComponent(partNum)}/colors/${colorId}/sets/`);
  url.searchParams.set("page_size", "25");

  const response = await fetch(url, {
    headers: {
      Authorization: `key ${apiKey}`,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Rebrickable set lookup failed: ${response.status} ${message}`);
  }

  const payload = (await response.json()) as {
    results?: RebrickableSetSummary[];
  };

  return payload.results ?? [];
}

export async function fetchSetParts(
  setNum: string,
  apiKey: string
): Promise<RebrickableSetPart[]> {
  const url = new URL(`${REBRICKABLE_API_BASE}/sets/${encodeURIComponent(setNum)}/parts/`);
  url.searchParams.set("page_size", "1000");

  const response = await fetch(url, {
    headers: {
      Authorization: `key ${apiKey}`,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Rebrickable set parts lookup failed: ${response.status} ${message}`);
  }

  const payload = (await response.json()) as {
    results?: RebrickableSetPart[];
  };

  return payload.results ?? [];
}
