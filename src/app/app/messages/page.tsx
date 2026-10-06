"use client";

import Link from "next/link";
import { useApp } from "@/lib/store";

export default function MessagesIndex() {
  const { currentUser, groups, trips, messages } = useApp();
  if (!currentUser) return null;
  const chats = groups
    .filter((g) => g.memberIds.includes(currentUser.id))
    .map((g) => {
      const trip = trips.find((t) => t.id === g.tripId);
      const last = [...messages].reverse().find((m) => m.groupId === g.id);
      return { g, trip, last };
    })
    .filter((x) => x.trip);

  return (
    <main className="mx-auto max-w-xl px-5 py-6">
      <h1 className="font-serif text-4xl">Messages</h1>
      <p className="mt-2 text-sm text-muted">Chats open once you are an accepted member of a group.</p>
      <div className="mt-6 space-y-2">
        {chats.map(({ g, trip, last }) => (
          <Link key={g.id} href={`/app/messages/${g.id}`} className="block rounded-3xl bg-card p-4 tm-shadow">
            <p className="font-medium">{trip?.destination} group</p>
            <p className="truncate text-sm text-muted">{last?.message ?? "No messages yet"}</p>
          </Link>
        ))}
        {chats.length === 0 && <p className="text-muted">No group chats yet.</p>}
      </div>
    </main>
  );
}
