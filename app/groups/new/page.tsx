import { createPrivateGroup, joinPrivateGroup } from "@/lib/actions";
import { AppShell } from "@/components/worldcup";

export default function NewGroupPage() {
  return (
    <AppShell title="Create or join a group" eyebrow="Invite-code leagues">
      <div className="grid gap-6 md:grid-cols-2">
        <form action={createPrivateGroup} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black">Create a private group</h2>
          <input name="name" placeholder="Office World Cup Challenge" className="mt-4 w-full rounded-md border border-slate-300 px-3 py-2" />
          <textarea name="description" placeholder="Optional description" className="mt-3 w-full rounded-md border border-slate-300 px-3 py-2" />
          <button className="mt-4 rounded-md bg-emerald-600 px-4 py-2 text-sm font-black text-white">Create group</button>
        </form>
        <form action={joinPrivateGroup} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black">Join with invite code</h2>
          <input name="inviteCode" placeholder="G9BALL" className="mt-4 w-full rounded-md border border-slate-300 px-3 py-2" />
          <button className="mt-4 rounded-md bg-slate-950 px-4 py-2 text-sm font-black text-white">Join group</button>
        </form>
      </div>
    </AppShell>
  );
}
