"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useRef, useState } from "react";
import { Breakdown } from "@/components/Compatibility";
import { ActivityChips, Stars, VerifiedBadge } from "@/components/Ui";
import { ageFromDob, firstName } from "@/lib/format";
import { useApp } from "@/lib/store";

function DiscoverInner() {
  const params = useSearchParams();
  const router = useRouter();
  const { groups, trips, currentUser, recommendedTravelers, inviteTraveler } = useApp();
  const groupId = params.get("group") ?? groups.find((g) => g.creatorId === currentUser?.id)?.id;
  const group = groups.find((g) => g.id === groupId);
  const trip = trips.find((t) => t.id === group?.tripId);
  const deck = useMemo(() => {
    if (!currentUser || !group) return [];
    return recommendedTravelers().filter(
      (row) => !group.memberIds.includes(row.user.id) && !group.pendingInviteIds.includes(row.user.id)
    );
  }, [currentUser, group, recommendedTravelers]);

  const [idx, setIdx] = useState(0);
  const [dx, setDx] = useState(0);
  const startX = useRef<number | null>(null);
  const current = deck[idx];

  function invite() {
    if (!group || !current) return;
    inviteTraveler(group.id, current.user.id);
    setDx(0);
    setIdx((i) => i + 1);
  }
  function skip() {
    setDx(0);
    setIdx((i) => i + 1);
  }

  function onPointerDown(e: React.PointerEvent) {
    startX.current = e.clientX;
  }
  function onPointerMove(e: React.PointerEvent) {
    if (startX.current == null) return;
    setDx(e.clientX - startX.current);
  }
  function onPointerUp() {
    if (startX.current == null) return;
    if (dx > 90) invite();
    else if (dx < -90) skip();
    else setDx(0);
    startX.current = null;
  }

  if (!group || !trip) {
    return (
      <main className="p-8">
        Create a trip first. <Link href="/app/create" className="text-forest">Create group</Link>
      </main>
    );
  }

  if (!current) {
    return (
      <main className="mx-auto max-w-md px-5 py-12 text-center">
        <h1 className="font-serif text-3xl">You’ve reviewed this list</h1>
        <p className="mt-2 text-muted">Invited travellers will appear in your group as pending until they accept.</p>
        <button onClick={() => router.push(`/app/trips/${group.id}`)} className="mt-6 rounded-full bg-forest px-6 py-3 text-white">
          Open your group
        </button>
      </main>
    );
  }

  const u = current.user;
  const rot = dx / 18;

  return (
    <main className="mx-auto max-w-md px-5 py-6">
      <p className="text-sm text-muted">Finding travellers for {trip.destination}</p>
      <h1 className="font-serif text-3xl">Invite to your trip</h1>
      <p className="mt-1 text-xs text-muted">Swipe right to invite · left to skip. This is a group-building deck, not a dating feed.</p>

      <article
        className="swipe-card relative mt-5 overflow-hidden rounded-[1.8rem] bg-card tm-shadow"
        style={{ transform: `translateX(${dx}px) rotate(${rot}deg)` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <img src={u.profilePhoto} alt="" className="h-72 w-full object-cover" />
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-serif text-3xl">
                {firstName(u.name)}, {ageFromDob(u.dateOfBirth)}
              </h2>
              <p className="text-sm text-muted">{u.city}</p>
            </div>
            {u.verificationStatus === "verified" && <VerifiedBadge />}
          </div>
          <p className="mt-2">
            {u.travelPersonality?.emoji} {u.travelPersonality?.title}
          </p>
          <p className="mt-2 font-serif text-3xl text-forest">{current.score.overall}% Compatible</p>
          <p className="mt-3 text-xs uppercase tracking-wide text-muted">Shared interests</p>
          <div className="mt-2">
            <ActivityChips ids={u.compatibilityAnswers?.activities.slice(0, 4) ?? []} />
          </div>
          <p className="mt-3 text-sm">Travel experience: {u.completedTripCount} trips</p>
          <p className="text-sm">
            <Stars value={u.rating || 0} />
          </p>
          <p className="mt-2 text-sm text-muted">Budget band: {u.compatibilityAnswers?.budget}</p>
          <Link href={`/app/travelers/${u.id}`} className="mt-3 inline-block text-sm text-forest">
            Full profile
          </Link>
        </div>
      </article>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button onClick={skip} className="rounded-full border border-line py-3">
          Skip
        </button>
        <button onClick={invite} className="rounded-full bg-forest py-3 text-white">
          Invite
        </button>
      </div>
      <details className="mt-4 rounded-2xl bg-card p-4 text-sm">
        <summary>Compatibility breakdown</summary>
        <div className="mt-3">
          <Breakdown score={current.score} />
        </div>
      </details>
    </main>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading travellers…</div>}>
      <DiscoverInner />
    </Suspense>
  );
}
