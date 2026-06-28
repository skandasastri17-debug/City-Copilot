export type ScoreAxis =
  | "Amenity"
  | "Transit"
  | "Food"
  | "Green"
  | "Development"
  | "Civic"
  | "Culture"
  | "Recreation"
  | "Service";

export type LegacyAxis = "Transit" | "Services" | "Housing" | "Green space" | "Safety" | "Development";

export type NeighborhoodProfile = {
  id: string;
  name: string;
  addressHint: string;
  summary: string;
  score: number;
  rank: string;
  trend: "Improving" | "Stable" | "Watch";
  axes: Record<LegacyAxis, number>;
  dna: Record<ScoreAxis, number>;
  signals: string[];
  risks: string[];
  anomalies: string[];
  verdicts: string[];
  forecast: number[];
  counts: Record<string, number>;
  coords?: { lat: number; lon: number };
  source?: "Live" | "Demo fallback";
  liveLeads?: Array<{
    title: string;
    source: string;
    url?: string;
    description: string;
  }>;
};

export type Scenario = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  reason: string;
  impact: Partial<Record<ScoreAxis, number>>;
};

export type CivicProposal = {
  id: string;
  title: string;
  category: string;
  area: string;
  summary: string;
  civicAction: string;
  meetingDate: string;
  link: string;
  emailTemplate: string;
  impact: Partial<Record<LegacyAxis, number>>;
};

export const scoreAxes: LegacyAxis[] = ["Transit", "Services", "Housing", "Green space", "Safety", "Development"];
export const dnaAxes: ScoreAxis[] = ["Amenity", "Transit", "Food", "Green", "Development", "Civic", "Culture", "Recreation", "Service"];

export const neighborhoods: NeighborhoodProfile[] = [
  {
    id: "scarborough-centre",
    name: "Scarborough Centre",
    addressHint: "150 Borough Drive",
    summary: "A high-growth civic hub with strong transit access, active construction, and pressure on housing affordability.",
    score: 78,
    rank: "Top 22%",
    trend: "Improving",
    axes: { Transit: 86, Services: 82, Housing: 61, "Green space": 58, Safety: 74, Development: 91 },
    dna: { Amenity: 79, Transit: 86, Food: 72, Green: 58, Development: 91, Civic: 88, Culture: 67, Recreation: 63, Service: 82 },
    signals: ["Subway extension planning is increasing development pressure.", "Library and civic services are clustered within a short walk.", "Public realm improvements would lift the green space score."],
    risks: ["Construction disruption", "Rising rents", "Pedestrian safety near arterial roads"],
    anomalies: ["Development permits are above the local baseline.", "Green access trails the city average."],
    verdicts: ["GROWTH FRONT-RUNNER", "TRANSIT ADVANTAGE", "PUBLIC REALM GAP"],
    forecast: [72, 74, 76, 78, 81, 83],
    counts: { restaurants: 42, cafes: 19, schools: 8, groceries: 6, parks: 5, transit: 31, permits: 18, complaints: 11 }
  },
  {
    id: "liberty-village",
    name: "Liberty Village",
    addressHint: "171 East Liberty Street",
    summary: "Dense, walkable, and service-rich, but crowding and limited parks create quality-of-life tension.",
    score: 74,
    rank: "Top 31%",
    trend: "Stable",
    axes: { Transit: 78, Services: 88, Housing: 56, "Green space": 43, Safety: 69, Development: 84 },
    dna: { Amenity: 91, Transit: 78, Food: 92, Green: 43, Development: 84, Civic: 61, Culture: 73, Recreation: 55, Service: 88 },
    signals: ["Food and daily services are unusually dense.", "Transit demand outpaces local street capacity.", "Park access is the main livability drag."],
    risks: ["Congestion", "Low park access", "Noise complaints"],
    anomalies: ["Park access is critically below density demand.", "Food access is unusually high."],
    verdicts: ["AMENITY RICH", "PARK DEFICIT", "CONGESTION WATCH"],
    forecast: [73, 74, 74, 75, 75, 76],
    counts: { restaurants: 84, cafes: 37, schools: 3, groceries: 9, parks: 2, transit: 22, permits: 13, complaints: 24 }
  },
  {
    id: "regent-park",
    name: "Regent Park",
    addressHint: "620 Dundas Street East",
    summary: "A mixed-income redevelopment area with strong community assets and improving public space.",
    score: 81,
    rank: "Top 17%",
    trend: "Improving",
    axes: { Transit: 82, Services: 86, Housing: 70, "Green space": 76, Safety: 72, Development: 79 },
    dna: { Amenity: 82, Transit: 82, Food: 77, Green: 76, Development: 79, Civic: 89, Culture: 81, Recreation: 84, Service: 86 },
    signals: ["Community services are highly accessible.", "Recent public realm investment is raising livability.", "Mixed-use density supports walkability."],
    risks: ["Affordability pressure", "Construction fatigue", "Service demand growth"],
    anomalies: ["Community service density is above baseline.", "Mixed-use development is stabilizing."],
    verdicts: ["COMMUNITY ASSET CLUSTER", "BALANCED GROWTH", "SERVICE STRENGTH"],
    forecast: [75, 77, 79, 81, 83, 84],
    counts: { restaurants: 36, cafes: 16, schools: 9, groceries: 7, parks: 8, transit: 26, permits: 10, complaints: 9 }
  },
  {
    id: "north-york-centre",
    name: "North York Centre",
    addressHint: "5100 Yonge Street",
    summary: "A transit-oriented centre with strong civic access and a need for safer, more human-scaled streets.",
    score: 76,
    rank: "Top 27%",
    trend: "Watch",
    axes: { Transit: 91, Services: 79, Housing: 63, "Green space": 54, Safety: 66, Development: 86 },
    dna: { Amenity: 76, Transit: 91, Food: 70, Green: 54, Development: 86, Civic: 92, Culture: 78, Recreation: 66, Service: 79 },
    signals: ["Subway access is excellent.", "Civic and cultural facilities are nearby.", "Wide roads reduce comfort for walking and biking."],
    risks: ["Street safety", "Tower growth without enough public space", "Heat island exposure"],
    anomalies: ["Transit is extremely strong.", "Street comfort lags the civic centre role."],
    verdicts: ["CIVIC NODE", "TRANSIT POWERHOUSE", "SAFETY WATCH"],
    forecast: [76, 76, 75, 76, 77, 78],
    counts: { restaurants: 58, cafes: 24, schools: 6, groceries: 8, parks: 4, transit: 38, permits: 16, complaints: 17 }
  }
];

export const scenarios: Scenario[] = [
  { id: "bike-lanes", name: "Protected bike lanes", emoji: "BIKE", description: "Safer last-mile routes around civic anchors.", reason: "Protected lanes reduce collision risk and improve access to transit.", impact: { Transit: 3, Green: 2, Civic: 2, Service: 1 } },
  { id: "parkette", name: "New parkette", emoji: "PARK", description: "A small public space where park access is weak.", reason: "Small parks improve heat relief, seating, and daily recreation.", impact: { Green: 10, Recreation: 5, Culture: 1 } },
  { id: "service-hub", name: "One-stop service hub", emoji: "HUB", description: "Housing, newcomer, and benefits support in one place.", reason: "Bundled services reduce friction for residents who need help quickly.", impact: { Service: 9, Civic: 5, Amenity: 2 } },
  { id: "affordable-housing", name: "Affordable housing stream", emoji: "HOME", description: "Mixed-income access near transit.", reason: "Affordable housing near transit improves access without adding car dependence.", impact: { Development: 4, Transit: 2, Service: 2 } },
  { id: "transit-cut", name: "Transit service cut", emoji: "CUT", description: "Lower route frequency during peak hours.", reason: "Transit cuts reduce access and push pressure onto local streets.", impact: { Transit: -12, Amenity: -3, Service: -4 } },
  { id: "grocery", name: "New grocery access", emoji: "FOOD", description: "A fresh food anchor within walking distance.", reason: "Grocery access improves daily livability and reduces travel burden.", impact: { Food: 12, Amenity: 4, Service: 2 } }
];

export const proposals: CivicProposal[] = [
  {
    id: "eglinton-bus-priority",
    title: "Bus priority lanes near Scarborough Centre",
    category: "Transit",
    area: "Scarborough Centre",
    summary: "A proposal to give buses more reliable movement through a fast-growing employment and civic district.",
    civicAction: "Send feedback before the next infrastructure committee meeting.",
    meetingDate: "2026-07-14",
    link: "https://www.toronto.ca/services-payments/streets-parking-transportation/",
    emailTemplate: "Hello Councillor,\n\nI support bus priority near Scarborough Centre because reliable transit would help residents reach jobs, school, and civic services.\n\nPlease consider protected walking and cycling connections as part of the plan.",
    impact: { Transit: 8, Safety: 3 }
  },
  {
    id: "liberty-parkette",
    title: "Micro-park pilot in Liberty Village",
    category: "Parks",
    area: "Liberty Village",
    summary: "A small public-space conversion could relieve park pressure in one of Toronto's densest residential districts.",
    civicAction: "Add the public meeting to your calendar and send a short support note.",
    meetingDate: "2026-07-21",
    link: "https://www.toronto.ca/services-payments/water-environment/trees/",
    emailTemplate: "Hello,\n\nI support the Liberty Village micro-park pilot. The neighborhood needs more shade, seating, and flexible public space within walking distance.\n\nPlease prioritize accessibility and maintenance funding.",
    impact: { "Green space": 10, Safety: 2 }
  },
  {
    id: "regent-service-hub",
    title: "Expanded newcomer service hours",
    category: "Community services",
    area: "Regent Park",
    summary: "Extended evening service hours would make city support easier to reach for families, newcomers, and shift workers.",
    civicAction: "Email the service planning team with a resident-centered note.",
    meetingDate: "2026-08-05",
    link: "https://www.toronto.ca/community-people/",
    emailTemplate: "Hello,\n\nPlease support extended newcomer service hours in Regent Park. Evening access would help residents who cannot visit during normal work hours.\n\nThank you.",
    impact: { Services: 9, Housing: 2 }
  },
  {
    id: "yonge-complete-street",
    title: "Yonge Street complete street safety package",
    category: "Safety",
    area: "North York Centre",
    summary: "A safer street design would add shorter crossings, traffic calming, and better cycling access around the civic centre.",
    civicAction: "Review the notice and send comments focused on pedestrian safety.",
    meetingDate: "2026-08-12",
    link: "https://www.toronto.ca/services-payments/streets-parking-transportation/road-safety/",
    emailTemplate: "Hello,\n\nI support the Yonge Street complete street safety package. Please prioritize shorter crossings, protected cycling space, and safer access to civic buildings.\n\nSincerely,",
    impact: { Safety: 11, Transit: 2 }
  }
];

export function getNeighborhood(id: string) {
  return neighborhoods.find((neighborhood) => neighborhood.id === id) ?? neighborhoods[0];
}

export function applyScenarios(profile: NeighborhoodProfile, scenarioIds: string[]) {
  const dna = { ...profile.dna };
  const active = scenarios.filter((scenario) => scenarioIds.includes(scenario.id));

  active.forEach((scenario) => {
    Object.entries(scenario.impact).forEach(([axis, delta]) => {
      const key = axis as ScoreAxis;
      dna[key] = clamp(dna[key] + (delta ?? 0));
    });
  });

  const score = scoreFromDna(dna);
  return { score, dna, active, delta: score - profile.score };
}

export function applyScenario(profile: NeighborhoodProfile, scenarioId: string) {
  const projected = applyScenarios(profile, scenarioId ? [scenarioId] : []);
  return {
    score: projected.score,
    axes: profile.axes,
    scenario: scenarios.find((scenario) => scenario.id === scenarioId) ?? null
  };
}

export function scoreFromDna(dna: Record<ScoreAxis, number>) {
  return Math.round(dnaAxes.reduce((sum, axis) => sum + dna[axis], 0) / dnaAxes.length);
}

export function proposalScore(proposal: CivicProposal) {
  return Object.values(proposal.impact).reduce((sum, value) => sum + (value ?? 0), 0);
}

export function nearestNeighborhood(query: string) {
  const normalized = query.toLowerCase();
  return (
    neighborhoods.find((neighborhood) => {
      const haystack = `${neighborhood.name} ${neighborhood.addressHint}`.toLowerCase();
      return normalized.includes(neighborhood.name.toLowerCase()) || haystack.includes(normalized);
    }) ?? neighborhoods[Math.abs(hashString(query)) % neighborhoods.length]
  );
}

export function hashString(value: string) {
  return value.split("").reduce((hash, character) => (hash * 31 + character.charCodeAt(0)) | 0, 7);
}

export function legacyToDna(axes: Record<LegacyAxis, number>, seed = 0): Record<ScoreAxis, number> {
  return {
    Amenity: clamp(Math.round((axes.Services + axes.Transit) / 2) + (seed % 5) - 2),
    Transit: axes.Transit,
    Food: clamp(axes.Services + ((seed >> 1) % 9) - 4),
    Green: axes["Green space"],
    Development: axes.Development,
    Civic: clamp(Math.round((axes.Services + axes.Safety) / 2)),
    Culture: clamp(axes.Services + ((seed >> 2) % 11) - 5),
    Recreation: clamp(Math.round((axes["Green space"] + axes.Services) / 2)),
    Service: axes.Services
  };
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, value));
}
