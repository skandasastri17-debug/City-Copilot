import type { Category, FeedPost, Opportunity, Organization, Shift, Signup } from "@/lib/types";

export const categories: Category[] = [
  { id: "cat_food", name: "Food banks", slug: "food-banks", color: "bg-emerald-100 text-emerald-900" },
  { id: "cat_seniors", name: "Seniors support", slug: "seniors-support", color: "bg-sky-100 text-sky-900" },
  { id: "cat_sports", name: "Youth sports", slug: "youth-sports", color: "bg-orange-100 text-orange-900" },
  { id: "cat_schools", name: "Schools", slug: "schools", color: "bg-violet-100 text-violet-900" },
  { id: "cat_parks", name: "Environment/parks", slug: "environment-parks", color: "bg-lime-100 text-lime-900" },
  { id: "cat_events", name: "Community events", slug: "community-events", color: "bg-amber-100 text-amber-950" },
  { id: "cat_donations", name: "Donations", slug: "donations", color: "bg-rose-100 text-rose-900" },
  { id: "cat_skills", name: "Skill-based help", slug: "skill-based-help", color: "bg-indigo-100 text-indigo-900" },
  { id: "cat_urgent", name: "Emergency/urgent help", slug: "emergency-urgent-help", color: "bg-red-100 text-red-900" },
  { id: "cat_other", name: "Other", slug: "other", color: "bg-stone-100 text-stone-900" }
];

export const organizations: Organization[] = [
  {
    id: "org_eden_food",
    name: "Eden Community Food Bank",
    type: "Food bank",
    description: "A neighbourhood food bank supporting families across western Mississauga.",
    city: "Mississauga",
    province: "ON",
    postalCode: "L5N 2R7",
    website: "https://example.org/eden",
    verified: true
  },
  {
    id: "org_port_credit_soccer",
    name: "Port Credit Youth Soccer",
    type: "Sports club",
    description: "Volunteer-run youth soccer club helping kids play safely and affordably.",
    city: "Mississauga",
    province: "ON",
    postalCode: "L5G 1E2",
    verified: true
  },
  {
    id: "org_riverwood",
    name: "Riverwood Conservancy",
    type: "Environmental nonprofit",
    description: "Stewards of trails, parks, and native plant education near the Credit River.",
    city: "Mississauga",
    province: "ON",
    postalCode: "L5C 2S7",
    verified: true
  },
  {
    id: "org_swansea_school",
    name: "Swansea School Council",
    type: "School council",
    description: "Parents and staff organizing student events and fundraisers.",
    city: "Toronto",
    province: "ON",
    postalCode: "M6S 4Y8",
    verified: true
  },
  {
    id: "org_erin_seniors",
    name: "Erin Mills Senior Centre",
    type: "Community centre",
    description: "Programs, rides, and wellness support for older adults.",
    city: "Mississauga",
    province: "ON",
    postalCode: "L5M 6R5",
    verified: true
  },
  {
    id: "org_taste_dixie",
    name: "Taste of Dixie Festival",
    type: "Local organizer",
    description: "Annual community festival celebrating local food, music, and small businesses.",
    city: "Mississauga",
    province: "ON",
    postalCode: "L4Y 2B8",
    verified: false
  }
];

export const opportunities: Opportunity[] = [
  {
    id: "opp_food_sort_today",
    title: "Food bank needs 3 volunteers today",
    description: "Help sort fresh produce, pack emergency hampers, and greet families during the afternoon pickup window. Training is provided on arrival.",
    organizationId: "org_eden_food",
    categorySlug: "food-banks",
    locationName: "Eden Community Food Bank",
    address: "3185 Unity Dr",
    city: "Mississauga",
    province: "ON",
    postalCode: "L5L 4L5",
    latitude: 43.5372,
    longitude: -79.6906,
    urgencyLevel: "critical",
    status: "published",
    requiredSkills: ["Friendly greeting", "Light lifting"],
    interests: ["Food security", "Urgent help"],
    familyFriendly: false,
    minAge: 16,
    distanceKm: 2.1,
    createdAt: "2026-06-10T10:00:00Z",
    updatedAt: "2026-06-11T08:00:00Z"
  },
  {
    id: "opp_soccer_linesperson",
    title: "Linesperson for U12 soccer tonight",
    description: "Port Credit Youth Soccer needs a sideline helper for tonight's U12 match. No certification required; a coach will explain the basics.",
    organizationId: "org_port_credit_soccer",
    categorySlug: "youth-sports",
    locationName: "Port Credit Memorial Park",
    address: "40 Lakeshore Rd E",
    city: "Mississauga",
    province: "ON",
    postalCode: "L5G 1S4",
    latitude: 43.5527,
    longitude: -79.5868,
    urgencyLevel: "high",
    status: "published",
    requiredSkills: ["Youth sports", "Reliability"],
    interests: ["Youth sports", "Family activities"],
    familyFriendly: true,
    minAge: 14,
    distanceKm: 6.4,
    createdAt: "2026-06-09T12:00:00Z",
    updatedAt: "2026-06-11T09:30:00Z"
  },
  {
    id: "opp_school_fundraiser",
    title: "School fundraiser donated items",
    description: "Donate baked goods, raffle items, craft supplies, or help sort table displays before the evening fundraiser.",
    organizationId: "org_swansea_school",
    categorySlug: "schools",
    locationName: "Swansea Public School",
    address: "207 Windermere Ave",
    city: "Toronto",
    province: "ON",
    postalCode: "M6S 3J9",
    latitude: 43.6441,
    longitude: -79.4806,
    urgencyLevel: "medium",
    status: "published",
    requiredSkills: ["Event setup", "Donations"],
    interests: ["Schools", "Donations"],
    familyFriendly: true,
    minAge: 12,
    distanceKm: 14.8,
    createdAt: "2026-06-07T16:00:00Z",
    updatedAt: "2026-06-10T13:15:00Z"
  },
  {
    id: "opp_park_cleanup",
    title: "Saturday park cleanup at Riverwood",
    description: "Join neighbours for litter pickup, invasive plant removal, and trail edge cleanup. Gloves and bags are provided.",
    organizationId: "org_riverwood",
    categorySlug: "environment-parks",
    locationName: "Riverwood Conservancy",
    address: "4300 Riverwood Park Ln",
    city: "Mississauga",
    province: "ON",
    postalCode: "L5C 2S7",
    latitude: 43.5657,
    longitude: -79.6605,
    urgencyLevel: "medium",
    status: "published",
    requiredSkills: ["Outdoor work"],
    interests: ["Environment", "Parks"],
    familyFriendly: true,
    minAge: 8,
    distanceKm: 3.7,
    createdAt: "2026-06-05T09:00:00Z",
    updatedAt: "2026-06-10T11:15:00Z"
  },
  {
    id: "opp_seniors_drivers",
    title: "Drivers for senior centre appointments",
    description: "Volunteer drivers are needed next week to help older adults get to medical appointments and grocery trips.",
    organizationId: "org_erin_seniors",
    categorySlug: "seniors-support",
    locationName: "Erin Mills Senior Centre",
    address: "3400 Erin Centre Blvd",
    city: "Mississauga",
    province: "ON",
    postalCode: "L5M 7R1",
    latitude: 43.5577,
    longitude: -79.7294,
    urgencyLevel: "high",
    status: "published",
    requiredSkills: ["Valid licence", "Own vehicle", "Patience"],
    interests: ["Seniors", "Transportation"],
    familyFriendly: false,
    minAge: 21,
    distanceKm: 5.6,
    createdAt: "2026-06-08T08:30:00Z",
    updatedAt: "2026-06-11T07:20:00Z"
  },
  {
    id: "opp_festival_setup",
    title: "Community festival setup crew",
    description: "Help set up vendor tables, water stations, and wayfinding signs for a summer neighbourhood festival.",
    organizationId: "org_taste_dixie",
    categorySlug: "community-events",
    locationName: "Dixie Outlet Community Lot",
    address: "1250 South Service Rd",
    city: "Mississauga",
    province: "ON",
    postalCode: "L5E 1V4",
    latitude: 43.5936,
    longitude: -79.5689,
    urgencyLevel: "low",
    status: "published",
    requiredSkills: ["Event setup", "Teamwork"],
    interests: ["Community events"],
    familyFriendly: true,
    minAge: 15,
    distanceKm: 8.2,
    createdAt: "2026-06-03T14:30:00Z",
    updatedAt: "2026-06-09T15:45:00Z"
  },
  {
    id: "opp_diaper_drive",
    title: "Diaper and baby formula donation drive",
    description: "The food bank is collecting unopened diapers, wipes, and baby formula for families with infants.",
    organizationId: "org_eden_food",
    categorySlug: "donations",
    locationName: "Meadowvale Community Hub",
    address: "6655 Glen Erin Dr",
    city: "Mississauga",
    province: "ON",
    postalCode: "L5N 3L4",
    latitude: 43.5884,
    longitude: -79.7594,
    urgencyLevel: "high",
    status: "published",
    requiredSkills: ["Donation drop-off"],
    interests: ["Donations", "Food security"],
    familyFriendly: true,
    minAge: 0,
    distanceKm: 7.1,
    createdAt: "2026-06-06T10:30:00Z",
    updatedAt: "2026-06-10T18:00:00Z"
  }
];

export const shifts: Shift[] = [
  { id: "shift_food_today", opportunityId: "opp_food_sort_today", startsAt: "2026-06-11T14:00:00-04:00", endsAt: "2026-06-11T16:00:00-04:00", capacity: 5, signupCount: 2, checkedInCount: 0 },
  { id: "shift_soccer_evening", opportunityId: "opp_soccer_linesperson", startsAt: "2026-06-11T18:30:00-04:00", endsAt: "2026-06-11T20:15:00-04:00", capacity: 2, signupCount: 1, checkedInCount: 0 },
  { id: "shift_school_day", opportunityId: "opp_school_fundraiser", startsAt: "2026-06-13T15:00:00-04:00", endsAt: "2026-06-13T18:00:00-04:00", capacity: 8, signupCount: 5, checkedInCount: 0 },
  { id: "shift_park_sat", opportunityId: "opp_park_cleanup", startsAt: "2026-06-14T09:00:00-04:00", endsAt: "2026-06-14T12:00:00-04:00", capacity: 25, signupCount: 16, checkedInCount: 0 },
  { id: "shift_seniors_mon", opportunityId: "opp_seniors_drivers", startsAt: "2026-06-16T09:00:00-04:00", endsAt: "2026-06-16T13:00:00-04:00", capacity: 4, signupCount: 1, checkedInCount: 0 },
  { id: "shift_festival_setup", opportunityId: "opp_festival_setup", startsAt: "2026-06-20T08:00:00-04:00", endsAt: "2026-06-20T11:00:00-04:00", capacity: 14, signupCount: 6, checkedInCount: 0 },
  { id: "shift_diaper_drive", opportunityId: "opp_diaper_drive", startsAt: "2026-06-12T10:00:00-04:00", endsAt: "2026-06-12T15:00:00-04:00", capacity: 10, signupCount: 4, checkedInCount: 0 }
];

export const signups: Signup[] = [
  { id: "signup_1", opportunityId: "opp_park_cleanup", shiftId: "shift_park_sat", status: "confirmed" },
  { id: "signup_2", opportunityId: "opp_school_fundraiser", shiftId: "shift_school_day", status: "confirmed" }
];

export const posts: FeedPost[] = [
  {
    id: "post_1",
    title: "Cooling centre hours extended",
    body: "The Meadowvale Community Hub will remain open until 9 PM during this week's heat alert.",
    type: "announcement",
    organizationId: "org_erin_seniors",
    status: "approved",
    reports: 0,
    createdAt: "2026-06-10T18:00:00Z"
  },
  {
    id: "post_2",
    title: "Gently used cleats needed",
    body: "Youth soccer families are looking for clean cleats in sizes 2-6 before the weekend tournament.",
    type: "donation",
    organizationId: "org_port_credit_soccer",
    status: "pending",
    reports: 1,
    createdAt: "2026-06-11T09:30:00Z"
  },
  {
    id: "post_3",
    title: "Newcomer welcome picnic",
    body: "Bring a blanket and meet neighbours at Celebration Square on Sunday afternoon.",
    type: "event",
    organizationId: "org_taste_dixie",
    status: "approved",
    reports: 0,
    createdAt: "2026-06-09T12:15:00Z"
  }
];

export function getOrganization(id: string) {
  return organizations.find((organization) => organization.id === id);
}

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getOpportunity(id: string) {
  return opportunities.find((opportunity) => opportunity.id === id);
}

export function getShiftsForOpportunity(opportunityId: string) {
  return shifts.filter((shift) => shift.opportunityId === opportunityId);
}

export function openSpots(opportunityId: string) {
  return getShiftsForOpportunity(opportunityId).reduce((total, shift) => total + Math.max(shift.capacity - shift.signupCount, 0), 0);
}

export function nearMeScore(opportunity: Opportunity) {
  const urgencyScore = { low: 1, medium: 2, high: 3, critical: 4 }[opportunity.urgencyLevel] * 30;
  const soonestShift = getShiftsForOpportunity(opportunity.id).sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt))[0];
  const hoursAway = soonestShift ? Math.max((Date.parse(soonestShift.startsAt) - Date.parse("2026-06-11T10:00:00-04:00")) / 36e5, 0) : 72;
  const soonScore = Math.max(35 - hoursAway, 0);
  const distanceScore = Math.max(20 - opportunity.distanceKm, 0);
  const capacityScore = Math.min(openSpots(opportunity.id) * 3, 15);
  const matchScore = opportunity.interests.some((interest) => ["Food security", "Youth sports", "Environment", "Seniors"].includes(interest)) ? 10 : 4;

  return Math.round(urgencyScore + soonScore + distanceScore + capacityScore + matchScore);
}

export function rankedNearMe() {
  return [...opportunities].sort((a, b) => nearMeScore(b) - nearMeScore(a));
}
