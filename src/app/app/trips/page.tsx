"use client";

import Link from "next/link";
import { formatDateRange } from "@/lib/format";
import { useApp } from "@/lib/store";

export default function MyTripsPage() {
  const { currentUser, groups, trips } = useApp();
  if (!currentUser) return null;
  const mine = groups
    .filter((g) => g.memberIds.includes(currentUser.id) || g.creatorId === currentUser.id || g.pendingInviteIds.includes(currentUser.id) || g.joinRequestIds.includes(currentUser.id))
    .map((g) => ({ g, trip: trips.find((t) => t.id === g.tripId)! }))
    .filter((x) => x.trip);

  return (
    <main className="mx-auto max-w-3xl px-5 py-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-4xl">My Trips</h1>
        <Link href="/app/create" className="rounded-full bg-forest px-4 py-2 text-sm text-white">
          + Create Group
        </Link>
      </div>
      <div className="mt-6 space-y-3">
        {mine.map(({ g, trip }) => (
          <Link key={g.id} href={`/app/trips/${g.id}`} className="block overflow-hidden rounded-3xl bg-card tm-shadow">
            <div className="h-28 bg-cover bg-center" style={{ backgroundImage: `url(${trip.photos[0]})` }} />
            <div className="p-4">
              <p className="font-medium">{trip.destination}</p>
              <p className="text-sm text-muted">{formatDateRange(trip.startDate, trip.endDate)}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-muted">{trip.status} · {g.memberIds.length}/{trip.groupSize} members</p>
            </div>
          </Link>
        ))}
        {mine.length === 0 && <p className="text-muted">No trips yet.</p>}
      </div>
    </main>
  );
}
