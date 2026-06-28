export type ScoreAxis = "Transit" | "Services" | "Housing" | "Green space" | "Safety" | "Development";

export type NeighborhoodProfile = {
  id: string;
  name: string;
  addressHint: string;
  summary: string;
  score: number;
  rank: string;
  trend: "Improving" | "Stable" | "Watch";
  axes: Record<ScoreAxis, number>;
  signals: string[];
  risks: string[];
  forecast: number[];
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
  description: string;
  axis: ScoreAxis;
  delta: number;
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
  impact: Partial<Record<ScoreAxis, number>>;
};

export const scoreAxes: ScoreAxis[] = ["Transit", "Services", "Housing", "Green space", "Safety", "Development"];

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
    signals: ["Subway extension planning is increasing development pressure.", "Library and civic services are clustered within a short walk.", "Public realm improvements would lift the green space score."],
    risks: ["Construction disruption", "Rising rents", "Pedestrian safety near arterial roads"],
    forecast: [72, 74, 76, 78, 81, 83]
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
    signals: ["Food and daily services are unusually dense.", "Transit demand outpaces local street capacity.", "Park access is the main livability drag."],
    risks: ["Congestion", "Low park access", "Noise complaints"],
    forecast: [73, 74, 74, 75, 75, 76]
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
    signals: ["Community services are highly accessible.", "Recent public realm investment is raising livability.", "Mixed-use density supports walkability."],
    risks: ["Affordability pressure", "Construction fatigue", "Service demand growth"],
    forecast: [75, 77, 79, 81, 83, 84]
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
    signals: ["Subway access is excellent.", "Civic and cultural facilities are nearby.", "Wide roads reduce comfort for walking and biking."],
    risks: ["Street safety", "Tower growth without enough public space", "Heat island exposure"],
    forecast: [76, 76, 75, 76, 77, 78]
  }
];

export const scenarios: Scenario[] = [
  { id: "bike-lanes", name: "Protected bike lanes", description: "Adds safer last-mile routes around civic anchors.", axis: "Safety", delta: 7 },
  { id: "parkette", name: "New parkette", description: "Adds small public space where park access is weak.", axis: "Green space", delta: 9 },
  { id: "service-hub", name: "One-stop service hub", description: "Bundles housing, newcomer, and benefits support.", axis: "Services", delta: 6 },
  { id: "affordable-housing", name: "Affordable housing stream", description: "Improves mixed-income access near transit.", axis: "Housing", delta: 8 }
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

export function applyScenario(profile: NeighborhoodProfile, scenarioId: string) {
  const scenario = scenarios.find((item) => item.id === scenarioId);
  if (!scenario) return { score: profile.score, axes: profile.axes, scenario: null };

  const axes = { ...profile.axes, [scenario.axis]: Math.min(100, profile.axes[scenario.axis] + scenario.delta) };
  const score = Math.round(scoreAxes.reduce((sum, axis) => sum + axes[axis], 0) / scoreAxes.length);
  return { score, axes, scenario };
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
