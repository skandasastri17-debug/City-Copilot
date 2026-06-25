import Link from "next/link";
import { AppShell, PrivateGroupCard } from "@/components/worldcup";

export default function GroupsPage() {
  return (
    <AppShell title="Private groups" eyebrow="Friends, schools, workplaces, families">
      <div className="mb-5 flex justify-end"><Link href="/groups/new" className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-black text-white">Create group</Link></div>
      <div className="grid gap-4 md:grid-cols-3">
        <PrivateGroupCard name="Grade 9 Soccer Friends" code="G9BALL" members={18} />
        <PrivateGroupCard name="Office World Cup Challenge" code="OFFICE" members={42} />
        <PrivateGroupCard name="Family League" code="FAMILY" members={11} />
      </div>
    </AppShell>
  );
}
