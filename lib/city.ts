import {
  AlertTriangle,
  Bike,
  Building2,
  Bus,
  CloudSun,
  Code2,
  Droplets,
  GraduationCap,
  HeartHandshake,
  Home,
  Leaf,
  Library,
  LucideIcon,
  MapPin,
  Recycle,
  ShieldCheck,
  Snowflake,
  Trees,
  Users,
  Wrench
} from "lucide-react";

export type CityCategory =
  | "Infrastructure"
  | "Safety"
  | "Transit"
  | "Environment"
  | "Community Services"
  | "Housing"
  | "Parks & Recreation"
  | "Other";

export type Priority = "Low" | "Medium" | "High" | "Urgent";
export type ReportStatus = "Draft" | "Submitted" | "In Review" | "In Progress" | "Resolved";

export type Department = {
  name: string;
  category: CityCategory;
  responseWindow: string;
  contact: string;
};

export type CityReport = {
  id: string;
  title: string;
  category: CityCategory;
  priority: Priority;
  department: string;
  createdDate: string;
  status: ReportStatus;
  estimatedResponseTime: string;
  location: string;
  description: string;
  nextStep: string;
};

export type CityResource = {
  id: string;
  name: string;
  category: string;
  tags: string[];
  description: string;
  eligibility: string;
  location: string;
  contact: string;
  icon: LucideIcon;
};

export type CopilotResult = {
  category: CityCategory;
  confidence: number;
  summary: string;
  report: CityReport;
  suggestedActions: string[];
  similarIssues: CityReport[];
};

export const departments: Department[] = [
  { name: "Transportation Services", category: "Infrastructure", responseWindow: "3-7 business days", contact: "toronto.ca/311" },
  { name: "Traffic Management Centre", category: "Transit", responseWindow: "1-3 business days", contact: "toronto.ca/traffic" },
  { name: "Toronto Water", category: "Infrastructure", responseWindow: "2-5 business days", contact: "toronto.ca/water" },
  { name: "Municipal Licensing & Standards", category: "Safety", responseWindow: "2-4 business days", contact: "toronto.ca/mls" },
  { name: "Solid Waste Management Services", category: "Environment", responseWindow: "2-6 business days", contact: "toronto.ca/waste" },
  { name: "Social Development, Finance & Administration", category: "Community Services", responseWindow: "1-2 business days", contact: "toronto.ca/community" },
  { name: "Housing Secretariat", category: "Housing", responseWindow: "4-10 business days", contact: "toronto.ca/housing" },
  { name: "Parks, Forestry & Recreation", category: "Parks & Recreation", responseWindow: "3-8 business days", contact: "toronto.ca/parks" }
];

export const examplePrompts = [
  "My street floods every time it rains.",
  "The crosswalk near my school feels unsafe.",
  "Where can I find free coding classes?",
  "The bus is always late in my neighborhood.",
  "There is garbage piling up near the park."
];

export const reports: CityReport[] = [
  {
    id: "CC-TO-1048",
    title: "Recurring street flooding near Queen and Dufferin",
    category: "Infrastructure",
    priority: "High",
    department: "Toronto Water",
    createdDate: "June 17, 2026",
    status: "In Progress",
    estimatedResponseTime: "2-5 business days",
    location: "Queen Street West & Dufferin Street",
    description: "Stormwater is pooling after rainfall and may require catch basin inspection or drainage maintenance.",
    nextStep: "Field crew assigned to inspect catch basins and document drainage conditions."
  },
  {
    id: "CC-TO-1032",
    title: "Icy sidewalk outside local school",
    category: "Infrastructure",
    priority: "Urgent",
    department: "Transportation Services",
    createdDate: "June 14, 2026",
    status: "Resolved",
    estimatedResponseTime: "24-48 hours",
    location: "Bloor Street West near Keele Street",
    description: "A sidewalk used by students was reported as icy and difficult to pass safely.",
    nextStep: "Closed after salting and follow-up inspection."
  },
  {
    id: "CC-TO-1027",
    title: "Traffic signal outage at St. Clair and Bathurst",
    category: "Transit",
    priority: "Urgent",
    department: "Traffic Management Centre",
    createdDate: "June 12, 2026",
    status: "Under Review" as ReportStatus,
    estimatedResponseTime: "Same day",
    location: "St. Clair Avenue West & Bathurst Street",
    description: "Signal timing or outage concern affecting pedestrian and vehicle movement.",
    nextStep: "Operations desk validating signal telemetry before dispatch."
  },
  {
    id: "CC-TO-1015",
    title: "Garbage accumulation near Trinity Bellwoods Park",
    category: "Environment",
    priority: "Medium",
    department: "Solid Waste Management Services",
    createdDate: "June 8, 2026",
    status: "In Review",
    estimatedResponseTime: "2-6 business days",
    location: "Trinity Bellwoods Park, west entrance",
    description: "Overflowing public bins and loose garbage are affecting park access and cleanliness.",
    nextStep: "Route supervisor reviewing bin capacity and pickup cadence."
  }
];

export const resources: CityResource[] = [
  {
    id: "res-1",
    name: "Free Youth Coding Program",
    category: "Education",
    tags: ["Youth", "Education", "Low Income"],
    description: "After-school coding, robotics, and digital portfolio workshops at library branches.",
    eligibility: "Toronto residents ages 12-18. Priority seats for low-income households.",
    location: "Toronto Public Library branches citywide",
    contact: "library.example/youth-code",
    icon: Code2
  },
  {
    id: "res-2",
    name: "Community Cooling Center",
    category: "Emergency",
    tags: ["Seniors", "Families", "Emergency"],
    description: "Air-conditioned public spaces with water, seating, device charging, and wellness checks during heat alerts.",
    eligibility: "Open to all residents during active heat alerts.",
    location: "Metro Hall, community centres, and selected libraries",
    contact: "toronto.example/cool-spaces",
    icon: CloudSun
  },
  {
    id: "res-3",
    name: "Recreation Fee Assistance",
    category: "Recreation",
    tags: ["Families", "Low Income", "Recreation"],
    description: "Subsidized registration for swim lessons, camps, fitness programs, and recreation passes.",
    eligibility: "Residents receiving eligible income supports or meeting income thresholds.",
    location: "Parks, Forestry & Recreation service desks",
    contact: "toronto.example/rec-assist",
    icon: Trees
  },
  {
    id: "res-4",
    name: "Seniors Transportation Support",
    category: "Mobility",
    tags: ["Seniors", "Low Income"],
    description: "Help planning accessible trips, community shuttles, and discounted transit options.",
    eligibility: "Residents 65+ or adults with accessibility needs.",
    location: "Seniors services hubs across Toronto",
    contact: "toronto.example/senior-rides",
    icon: Bus
  },
  {
    id: "res-5",
    name: "Public Library Job Help",
    category: "Employment",
    tags: ["Newcomers", "Low Income", "Education"],
    description: "Resume clinics, interview prep, job search computers, and employment databases.",
    eligibility: "Open to residents with a library card or guest pass.",
    location: "North York Central, Scarborough Civic Centre, and online",
    contact: "library.example/job-help",
    icon: Library
  },
  {
    id: "res-6",
    name: "Food Bank Locator",
    category: "Emergency",
    tags: ["Families", "Low Income", "Emergency", "Newcomers"],
    description: "Find nearby food banks, meal programs, and culturally specific food supports.",
    eligibility: "Varies by partner site. Most programs ask for postal code and household size.",
    location: "Neighborhood agencies citywide",
    contact: "toronto.example/food-support",
    icon: HeartHandshake
  },
  {
    id: "res-7",
    name: "Mental Wellness Support Line",
    category: "Health",
    tags: ["Youth", "Seniors", "Families", "Emergency"],
    description: "Confidential phone and chat support with referrals to local counseling and crisis services.",
    eligibility: "Open to Toronto residents. Crisis routing available 24/7.",
    location: "Phone and online",
    contact: "wellness.example/support",
    icon: ShieldCheck
  },
  {
    id: "res-8",
    name: "Newcomer Settlement Services",
    category: "Settlement",
    tags: ["Newcomers", "Families", "Education"],
    description: "Language assessment, school navigation, benefits help, and community orientation.",
    eligibility: "Permanent residents, protected persons, and eligible temporary residents.",
    location: "Civic centres and settlement agencies",
    contact: "toronto.example/newcomers",
    icon: Users
  }
];

const categoryRules: Record<CityCategory, { keywords: string[]; department: string; icon: LucideIcon }> = {
  Infrastructure: {
    keywords: ["pothole", "road", "sidewalk", "flood", "floods", "flooding", "drainage", "water", "icy", "ice", "snow", "street"],
    department: "Transportation Services",
    icon: Wrench
  },
  Safety: {
    keywords: ["unsafe", "crime", "lighting", "light", "crosswalk", "dangerous", "speeding", "violence"],
    department: "Municipal Licensing & Standards",
    icon: AlertTriangle
  },
  Transit: {
    keywords: ["bus", "train", "traffic", "bike lane", "bike", "parking", "streetcar", "subway", "late", "signal"],
    department: "Traffic Management Centre",
    icon: Bike
  },
  Environment: {
    keywords: ["garbage", "recycling", "pollution", "trees", "tree", "heat", "shade", "air", "litter", "waste"],
    department: "Solid Waste Management Services",
    icon: Leaf
  },
  "Community Services": {
    keywords: ["coding class", "classes", "subsidy", "seniors", "senior", "youth", "recreation", "cooling center", "cooling centre", "food", "job"],
    department: "Social Development, Finance & Administration",
    icon: HeartHandshake
  },
  Housing: {
    keywords: ["housing", "rent", "shelter", "eviction", "landlord", "tenant"],
    department: "Housing Secretariat",
    icon: Home
  },
  "Parks & Recreation": {
    keywords: ["park", "playground", "pool", "arena", "field", "trail", "recreation centre", "community centre"],
    department: "Parks, Forestry & Recreation",
    icon: Trees
  },
  Other: {
    keywords: [],
    department: "311 Toronto",
    icon: Building2
  }
};

export function getCategoryIcon(category: CityCategory) {
  return categoryRules[category].icon;
}

export function classifyRequest(input: string): CopilotResult {
  const text = input.toLowerCase();
  const scores = Object.entries(categoryRules).map(([category, rule]) => ({
    category: category as CityCategory,
    score: rule.keywords.reduce((sum, keyword) => (text.includes(keyword) ? sum + (keyword.includes(" ") ? 2 : 1) : sum), 0)
  }));

  const winner = scores.sort((a, b) => b.score - a.score)[0];
  const category = winner.score > 0 ? winner.category : "Other";
  const confidence = Math.min(96, Math.max(68, 78 + winner.score * 6));
  const priority = determinePriority(text, category);
  const department = resolveDepartment(text, category);
  const title = generateTitle(text, category);
  const responseWindow = departments.find((item) => item.name === department)?.responseWindow ?? "3-5 business days";
  const location = inferLocation(text);

  const report: CityReport = {
    id: "CC-TO-DRAFT",
    title,
    category,
    priority,
    department,
    createdDate: "Draft today",
    status: "Draft",
    estimatedResponseTime: priority === "Urgent" ? "Same day triage" : responseWindow,
    location,
    description: rewriteDescription(input, category),
    nextStep: nextStepFor(category, priority)
  };

  return {
    category,
    confidence,
    summary: buildSummary(input, category, department),
    report,
    suggestedActions: suggestedActionsFor(category),
    similarIssues: reports.filter((item) => item.category === category).slice(0, 3)
  };
}

function determinePriority(text: string, category: CityCategory): Priority {
  if (/(danger|urgent|broken traffic light|signal outage|flooding|ice|icy|crime|violence)/.test(text)) return "Urgent";
  if (/(unsafe|flood|traffic|school|seniors|heat|garbage piling|blocked)/.test(text)) return "High";
  if (category === "Community Services" || category === "Parks & Recreation") return "Medium";
  return "Medium";
}

function resolveDepartment(text: string, category: CityCategory) {
  if (/(flood|drainage|water)/.test(text)) return "Toronto Water";
  return categoryRules[category].department;
}

function generateTitle(text: string, category: CityCategory) {
  if (text.includes("flood")) return "Recurring street flooding report";
  if (text.includes("crosswalk")) return "Unsafe crosswalk concern";
  if (text.includes("coding")) return "Request for free youth coding classes";
  if (text.includes("bus")) return "Transit reliability concern";
  if (text.includes("garbage")) return "Garbage accumulation near public space";
  if (text.includes("pothole")) return "Road surface repair request";
  if (text.includes("shade")) return "Neighborhood shade improvement suggestion";
  return `${category} service request`;
}

function inferLocation(text: string) {
  if (text.includes("school")) return "Near local school, Toronto";
  if (text.includes("park")) return "Near neighborhood park, Toronto";
  if (text.includes("street") || text.includes("road")) return "Street address or nearest intersection needed";
  return "Toronto address, intersection, or postal code";
}

function rewriteDescription(input: string, category: CityCategory) {
  if (category === "Community Services") {
    return `Resident is seeking information about a city-supported service: ${input}`;
  }
  return `Resident reports: ${input} The request should be reviewed for service eligibility, location details, and dispatch requirements.`;
}

function buildSummary(input: string, category: CityCategory, department: string) {
  if (category === "Community Services") {
    return `You are looking for a local support or program. This likely belongs to ${department}, with a resource referral rather than a maintenance ticket.`;
  }
  return `You are reporting ${input.replace(/[.?!]$/, "").toLowerCase()}. This likely belongs to ${department} and can be converted into a structured ${category.toLowerCase()} service request.`;
}

function nextStepFor(category: CityCategory, priority: Priority) {
  if (category === "Community Services") return "Match the resident to eligible Toronto resources and provide direct contact options.";
  if (priority === "Urgent") return "Route for same-day triage and request precise location details before dispatch.";
  if (category === "Transit") return "Send to traffic operations for service pattern review and field validation.";
  return "Submit to 311 intake and route to the responsible department for review.";
}

function suggestedActionsFor(category: CityCategory) {
  const common = ["Submit report", "View similar issues nearby", "Suggest a city improvement"];
  if (category === "Community Services") return ["Find related resources", "Save resource shortlist", "Ask about eligibility", "Share contact details"];
  return [...common, "Find related resources"];
}

export const resourceFilters = ["Youth", "Seniors", "Families", "Newcomers", "Low Income", "Emergency", "Recreation", "Education"];

export const timelineSteps = ["Submitted", "Routed to department", "Under review", "Field team assigned", "Resolved"];

export const torontoStats = [
  { label: "Mock departments", value: "8", detail: "311-ready routing paths" },
  { label: "Resource records", value: "24", detail: "Seed shape for service catalogs" },
  { label: "Avg. triage", value: "8s", detail: "Rule-based in this MVP" }
];

export const citySignals = [
  { label: "Lakefront heat alert", value: "Active", icon: CloudSun },
  { label: "Stormwater watch", value: "West end", icon: Droplets },
  { label: "Recycling pickup", value: "On schedule", icon: Recycle },
  { label: "Youth programs", value: "Open", icon: GraduationCap },
  { label: "Winter response", value: "Standby", icon: Snowflake },
  { label: "Road work", value: "47 zones", icon: MapPin }
];
