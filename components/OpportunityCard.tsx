import Link from "next/link";
import { CalendarDays, HeartHandshake, MapPin, Users } from "lucide-react";
import { UrgencyBadge, Pill } from "@/components/Badge";
import { formatDateTime } from "@/lib/format";
import { getCategory, getOrganization, getShiftsForOpportunity, openSpots } from "@/lib/data";
import type { Opportunity } from "@/lib/types";

export function OpportunityCard({ opportunity, showScore }: { opportunity: Opportunity; showScore?: number }) {
  const organization = getOrganization(opportunity.organizationId);
  const category = getCategory(opportunity.categorySlug);
  const firstShift = getShiftsForOpportunity(opportunity.id).sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt))[0];
  const spots = openSpots(opportunity.id);

  return (
    <article className="flex h-full flex-col rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <UrgencyBadge urgency={opportunity.urgencyLevel} />
        {category ? <Pill className={category.color}>{category.name}</Pill> : null}
        {showScore ? <Pill className="bg-moss text-white">Near me score {showScore}</Pill> : null}
      </div>
      <h3 className="text-xl font-bold text-ink">
        <Link href={`/opportunities/${opportunity.id}`} className="hover:text-moss">
          {opportunity.title}
        </Link>
      </h3>
      <p className="mt-1 text-sm font-medium text-stone-600">{organization?.name}</p>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-stone-700">{opportunity.description}</p>
      <dl className="mt-5 grid gap-3 text-sm text-stone-700">
        <div className="flex items-center gap-2">
          <CalendarDays aria-hidden="true" size={17} className="text-moss" />
          <dt className="sr-only">Date and time</dt>
          <dd>{firstShift ? formatDateTime(firstShift.startsAt) : "Flexible timing"}</dd>
        </div>
        <div className="flex items-center gap-2">
          <MapPin aria-hidden="true" size={17} className="text-moss" />
          <dt className="sr-only">Distance</dt>
          <dd>{opportunity.distanceKm.toFixed(1)} km away in {opportunity.city}</dd>
        </div>
        <div className="flex items-center gap-2">
          <Users aria-hidden="true" size={17} className="text-moss" />
          <dt className="sr-only">Open spots</dt>
          <dd>{spots} open spots</dd>
        </div>
        {opportunity.familyFriendly ? (
          <div className="flex items-center gap-2">
            <HeartHandshake aria-hidden="true" size={17} className="text-moss" />
            <dt className="sr-only">Family friendly</dt>
            <dd>Family-friendly</dd>
          </div>
        ) : null}
      </dl>
      <div className="mt-auto flex gap-3 pt-6">
        <Link href={`/opportunities/${opportunity.id}`} className="flex-1 rounded-md border border-stone-300 px-4 py-2 text-center text-sm font-semibold text-ink hover:bg-stone-50">
          View
        </Link>
        <Link href={`/opportunities/${opportunity.id}#shifts`} className="flex-1 rounded-md bg-moss px-4 py-2 text-center text-sm font-semibold text-white hover:bg-[#426a4d]">
          Sign up
        </Link>
      </div>
    </article>
  );
}
