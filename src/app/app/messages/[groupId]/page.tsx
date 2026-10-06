"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { formatDateRange } from "@/lib/format";
import { useApp } from "@/lib/store";

export default function ChatPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const { groups, trips, users, messages, currentUser, sendMessage, guides } = useApp();
  const [text, setText] = useState("");
  const group = groups.find((g) => g.id === groupId);
  const trip = trips.find((t) => t.id === group?.tripId);
  const guide = guides.find((g) => g.id === trip?.guideId);

  if (!group || !trip || !currentUser) return <main className="p-8">Chat not found.</main>;
  if (!group.memberIds.includes(currentUser.id)) {
    return <main className="p-8">Join and get accepted before chatting.</main>;
  }

  const thread = messages.filter((m) => m.groupId === group.id);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    sendMessage(group.id, text);
    setText("");
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col px-5 py-4">
      <div className="rounded-3xl bg-card p-4 tm-shadow">
        <h1 className="font-serif text-2xl">{trip.destination}</h1>
        <p className="text-xs text-muted">{formatDateRange(trip.startDate, trip.endDate)}</p>
        <details className="mt-2 text-sm">
          <summary>Trip details, itinerary & safety</summary>
          <p className="mt-2">{trip.description}</p>
          <ul className="mt-2 list-disc pl-4 text-muted">
            {trip.itinerary.map((d) => (
              <li key={d.day}>
                {d.day}: {d.title} — {d.details}
              </li>
            ))}
          </ul>
          {guide && (
            <p className="mt-2">
              Guide: <Link href={`/app/guides/${guide.id}`}>{guide.name}</Link>
            </p>
          )}
          {trip.emergencyInfo && <p className="mt-2 text-clay">{trip.emergencyInfo}</p>}
          <Link href="/app/safety" className="mt-2 inline-block text-forest">
            Safety centre
          </Link>
        </details>
      </div>

      <div className="mt-4 flex-1 space-y-2">
        {thread.map((m) => {
          const mine = m.senderId === currentUser.id;
          const sender = users.find((u) => u.id === m.senderId);
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${m.type === "system" ? "bg-sand text-muted" : mine ? "bg-forest text-white" : "bg-card"}`}>
                {m.type !== "system" && !mine && <p className="text-[10px] opacity-70">{sender?.name}</p>}
                <p>{m.message}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex gap-2 text-xs">
        <button className="rounded-full bg-sand px-3 py-1" onClick={() => sendMessage(group.id, `Shared location: near ${trip.destination} town centre`, "location")}>
          Share location
        </button>
        <button className="rounded-full bg-sand px-3 py-1" onClick={() => sendMessage(group.id, "Please keep emergency contacts updated in Safety.", "system")}>
          Safety note
        </button>
      </div>

      <form onSubmit={onSubmit} className="mt-3 flex gap-2">
        <input className="flex-1 rounded-full border border-line bg-card px-4 py-3" value={text} onChange={(e) => setText(e.target.value)} placeholder="Message the group" />
        <button className="rounded-full bg-forest px-4 py-3 text-white">Send</button>
      </form>
      <p className="mt-2 text-center text-xs text-muted">
        <Link href={`/app/trips/${group.id}`}>Group settings</Link> · Report via Safety
      </p>
    </main>
  );
}
