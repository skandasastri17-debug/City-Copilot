export type UserRole = "resident" | "org_admin" | "moderator" | "platform_admin";

export type UrgencyLevel = "low" | "medium" | "high" | "critical";

export type OpportunityStatus = "draft" | "published" | "closed" | "cancelled";

export type Category = {
  id: string;
  name: string;
  slug: string;
  color: string;
};

export type Organization = {
  id: string;
  name: string;
  type: string;
  description: string;
  city: string;
  province: string;
  postalCode: string;
  website?: string;
  verified: boolean;
};

export type Shift = {
  id: string;
  opportunityId: string;
  startsAt: string;
  endsAt: string;
  capacity: number;
  signupCount: number;
  checkedInCount: number;
};

export type Opportunity = {
  id: string;
  title: string;
  description: string;
  organizationId: string;
  categorySlug: string;
  locationName: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  urgencyLevel: UrgencyLevel;
  status: OpportunityStatus;
  requiredSkills: string[];
  interests: string[];
  familyFriendly: boolean;
  minAge: number;
  distanceKm: number;
  createdAt: string;
  updatedAt: string;
};

export type FeedPost = {
  id: string;
  title: string;
  body: string;
  type: "announcement" | "donation" | "event" | "urgent_help";
  organizationId: string;
  status: "pending" | "approved" | "rejected";
  reports: number;
  createdAt: string;
};

export type Signup = {
  id: string;
  opportunityId: string;
  shiftId: string;
  status: "confirmed" | "waitlisted" | "cancelled" | "attended" | "no_show";
};
