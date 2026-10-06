"use client";

import Link from "next/link";
import { formatDateRange } from "@/lib/format";
import { useApp } from "@/lib/store";

export default function InvitesPage() {
  const { invitations, trips, users, currentUser, respondInvite } = useApp();
  if (!currentUser) return null;
  const mine = invitations.filter((i) => i.toUserId === currentUser.id);

  return (
    <main className="mx-auto max-w-xl px-5 py-6">
      <h1 className="font-serif text-4xl">Invitations</h1>
      <p className="mt-2 text-sm text-muted">Accepting an invitation adds you to the group. The group is forming until people accept.</p>
      <div className="mt-6 space-y-3">
        {mine.map((inv) => {
          const trip = trips.find((t) => t.id === inv.tripId);
          const from = users.find((u) => u.id === inv.fromUserId);
          return (
            <article key={inv.id} className="rounded-3xl bg-card p-4 tm-shadow">
              <p className="font-medium">{trip?.destination}</p>
              <p className="text-sm text-muted">
                From {from?.name} · {trip && formatDateRange(trip.startDate, trip.endDate)}
              </p>
              <p className="mt-1 text-xs uppercase text-muted">{inv.status}</p>
              {inv.status === "pending" && (
                <div className="mt-3 flex gap-2">
                  <button onClick={() => respondInvite(inv.id, false)} className="flex-1 rounded-full border py-2">
                    Decline
                  </button>
                  <button onClick={() => respondInvite(inv.id, true)} className="flex-1 rounded-full bg-forest py-2 text-white">
                    Accept
                  </button>
                </div>
              )}
              {inv.status === "accepted" && trip && (
                <Link href={`/app/trips/${inv.groupId}`} className="mt-3 inline-block text-sm text-forest">
                  Open group
                </Link>
              )}
            </article>
          );
        })}
        {mine.length === 0 && <p className="text-muted">No invitations yet.</p>}
      </div>
    </main>
  );
}
