"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Breakdown } from "@/components/Compatibility";
import { VerifiedBadge } from "@/components/Ui";
import { formatDateRange, formatINR } from "@/lib/format";
import { useApp } from "@/lib/store";

export default function GroupManagePage() {
  const { groupId } = useParams<{ groupId: string }>();
  const router = useRouter();
  const {
    groups,
    trips,
    users,
    currentUser,
    respondJoin,
    removeMember,
    updateTrip,
    compatibilityWith,
    guides,
  } = useApp();
  const group = groups.find((g) => g.id === groupId);
  const trip = trips.find((t) => t.id === group?.tripId);
  const [editing, setEditing] = useState(false);
  const [desc, setDesc] = useState(trip?.description ?? "");

  if (!group || !trip || !currentUser) return <main className="p-8">Group not found.</main>;
  const isCreator = group.creatorId === currentUser.id;
  const isMember = group.memberIds.includes(currentUser.id);
  if (!isMember && !isCreator) {
    return (
      <main className="p-8">
        You are not a member of this group yet.{" "}
        <Link href={`/app/explore/${trip.id}`} className="text-forest">
          View trip
        </Link>
      </main>
    );
  }

  const members = group.memberIds.map((id) => users.find((u) => u.id === id)!).filter(Boolean);
  const pending = group.pendingInviteIds.map((id) => users.find((u) => u.id === id)!).filter(Boolean);
  const requests = group.joinRequestIds.map((id) => users.find((u) => u.id === id)!).filter(Boolean);
  const guide = guides.find((g) => g.id === trip.guideId);
  const needed = Math.max(trip.groupSize - group.memberIds.length, 0);

  return (
    <main className="mx-auto max-w-3xl px-5 py-6">
      <p className="text-sm text-muted">Your Group</p>
      <h1 className="font-serif text-4xl">{trip.destination}</h1>
      <p className="text-muted">{formatDateRange(trip.startDate, trip.endDate)}</p>
      <p className="mt-1 text-sm">
        {formatINR(trip.budgetMin)}–{formatINR(trip.budgetMax)} · {members.length}/{trip.groupSize} members
        {pending.length > 0 ? ` · Pending: ${pending.length}` : ""}
      </p>

      <section className="mt-6">
        <h2 className="font-serif text-2xl">Members</h2>
        <ul className="mt-3 space-y-2">
          {members.map((m) => {
            const score = m.id === currentUser.id ? null : compatibilityWith(m.id);
            return (
              <li key={m.id} className="flex items-center gap-3 rounded-2xl bg-card p-3">
                <img src={m.profilePhoto} alt="" className="h-12 w-12 rounded-full object-cover" />
                <div className="flex-1">
                  <Link href={`/app/travelers/${m.id}`} className="font-medium">
                    {m.id === currentUser.id ? "You" : m.name} {m.verificationStatus === "verified" && "✓"}
                  </Link>
                  {score && <p className="text-xs text-forest">{score.overall}% compatibility</p>}
                </div>
                {isCreator && m.id !== currentUser.id && (
                  <button onClick={() => removeMember(group.id, m.id)} className="text-xs text-clay">
                    Remove
                  </button>
                )}
              </li>
            );
          })}
          {pending.map((m) => (
            <li key={m.id} className="flex items-center gap-3 rounded-2xl bg-sand px-3 py-2 text-sm">
              Pending: {m.name}
            </li>
          ))}
        </ul>
      </section>

      {isCreator && requests.length > 0 && (
        <section className="mt-6">
          <h2 className="font-serif text-2xl">Join requests</h2>
          {requests.map((m) => (
            <div key={m.id} className="mt-2 flex items-center justify-between rounded-2xl bg-card p-3">
              <Link href={`/app/travelers/${m.id}`}>{m.name}</Link>
              <div className="flex gap-2">
                <button onClick={() => respondJoin(group.id, m.id, false)} className="rounded-full border px-3 py-1 text-sm">
                  Decline
                </button>
                <button onClick={() => respondJoin(group.id, m.id, true)} className="rounded-full bg-forest px-3 py-1 text-sm text-white">
                  Accept
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

      {isCreator && (
        <div className="mt-6 grid gap-2">
          <Link href={`/app/discover?group=${group.id}`} className="rounded-full bg-forest py-3 text-center text-white">
            Find travellers
          </Link>
          <Link href={`/app/guides?group=${group.id}`} className="rounded-full border border-line py-3 text-center">
            Find a guide
          </Link>
          <button onClick={() => setEditing(!editing)} className="rounded-full border border-line py-3">
            Edit trip
          </button>
        </div>
      )}

      {editing && (
        <div className="mt-4 rounded-3xl bg-card p-4">
          <textarea className="w-full rounded-2xl border border-line p-3" rows={4} value={desc} onChange={(e) => setDesc(e.target.value)} />
          <button
            className="mt-2 rounded-full bg-ink px-4 py-2 text-sm text-white"
            onClick={() => {
              updateTrip(trip.id, { description: desc });
              setEditing(false);
            }}
          >
            Save
          </button>
        </div>
      )}

      <section className="mt-6 rounded-3xl bg-card p-4">
        <h2 className="font-medium">Guide</h2>
        {guide ? (
          <Link href={`/app/guides/${guide.id}`} className="mt-2 flex items-center gap-3">
            <img src={guide.photo} alt="" className="h-12 w-12 rounded-full object-cover" />
            <div>
              <p>
                {guide.name} <VerifiedBadge />
              </p>
              <p className="text-xs text-muted">{guide.location}</p>
            </div>
          </Link>
        ) : (
          <p className="mt-1 text-sm text-muted">No guide assigned yet.</p>
        )}
      </section>

      {needed === 0 && group.memberIds.length >= 2 && (
        <p className="mt-4 rounded-2xl bg-sand px-4 py-3 text-sm">This group is formed. Chat is open for accepted members.</p>
      )}

      <Link href={`/app/messages/${group.id}`} className="mt-4 block rounded-full bg-ink py-3 text-center text-white">
        Group chat
      </Link>
      <button onClick={() => router.push("/app/safety")} className="mt-3 w-full text-sm text-muted">
        Safety tools
      </button>
    </main>
  );
}
