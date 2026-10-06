"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Breakdown } from "@/components/Compatibility";
import { ActivityChips, Stars, VerifiedBadge } from "@/components/Ui";
import { formatDateRange, formatINR } from "@/lib/format";
import { useApp } from "@/lib/store";

export default function GroupPublicPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const { trips, groups, users, reviews, currentUser, requestJoin, saveTrip, compatibilityWithTrip } = useApp();
  const trip = trips.find((t) => t.id === tripId);
  const group = groups.find((g) => g.tripId === tripId);
  if (!trip || !group || !currentUser) return <main className="p-8">Group not found.</main>;
  const creator = users.find((u) => u.id === trip.creatorId)!;
  const members = group.memberIds.map((id) => users.find((u) => u.id === id)!).filter(Boolean);
  const score = compatibilityWithTrip(trip.id);
  const tripReviews = reviews.filter((r) => r.tripId === trip.id && !r.isGuideReview);
  const isMember = group.memberIds.includes(currentUser.id);
  const requested = group.joinRequestIds.includes(currentUser.id);
  const saved = currentUser.savedTripIds.includes(trip.id);

  return (
    <main className="mx-auto max-w-3xl px-5 py-6">
      <div className="h-48 rounded-[1.8rem] bg-cover bg-center" style={{ backgroundImage: `url(${trip.photos[0]})` }} />
      <h1 className="mt-5 font-serif text-4xl">{trip.destination}</h1>
      <p className="mt-1 text-muted">
        {formatDateRange(trip.startDate, trip.endDate)} · {trip.startingLocation} → {trip.destination}
      </p>
      <p className="mt-1 text-sm">{formatINR(trip.budgetMin)}–{formatINR(trip.budgetMax)} · {members.length}/{trip.groupSize} members</p>

      {score && (
        <section className="mt-6 rounded-[1.6rem] bg-card p-5 tm-shadow">
          <Breakdown score={score} />
        </section>
      )}

      <section className="mt-6">
        <h2 className="font-serif text-2xl">Group creator</h2>
        <Link href={`/app/travelers/${creator.id}`} className="mt-3 flex items-center gap-3 rounded-2xl bg-card p-3 tm-shadow">
          <img src={creator.profilePhoto} alt="" className="h-14 w-14 rounded-full object-cover" />
          <div>
            <p className="font-medium">{creator.name}</p>
            {creator.verificationStatus === "verified" && <VerifiedBadge />}
          </div>
        </Link>
      </section>

      <section className="mt-6">
        <h2 className="font-serif text-2xl">Members</h2>
        <div className="mt-3 flex gap-3 overflow-x-auto">
          {members.map((m) => (
            <Link key={m.id} href={`/app/travelers/${m.id}`} className="w-24 shrink-0 text-center">
              <img src={m.profilePhoto} alt="" className="mx-auto h-16 w-16 rounded-full object-cover" />
              <p className="mt-1 text-xs">{m.name.split(" ")[0]}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="font-serif text-2xl">Itinerary</h2>
        <ul className="mt-3 space-y-2">
          {trip.itinerary.map((d) => (
            <li key={d.day} className="rounded-2xl bg-card px-4 py-3">
              <p className="text-xs text-muted">{d.day}</p>
              <p className="font-medium">{d.title}</p>
              <p className="text-sm text-muted">{d.details}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="font-serif text-2xl">Activities & budget</h2>
        <div className="mt-3">
          <ActivityChips ids={trip.activities} />
        </div>
        <p className="mt-3 text-sm">{trip.description}</p>
      </section>

      <section className="mt-6">
        <h2 className="font-serif text-2xl">Group rules</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
          {trip.rules.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="font-serif text-2xl">Reviews from previous trips</h2>
        {tripReviews.length === 0 && <p className="mt-2 text-sm text-muted">No reviews on this itinerary yet. Member reviews live on traveller profiles after completed trips.</p>}
        {tripReviews.map((r) => {
          const author = users.find((u) => u.id === r.reviewerId);
          return (
            <div key={r.id} className="mt-2 rounded-2xl bg-card p-4">
              <p className="text-sm font-medium">{author?.name} · <Stars value={r.rating} /></p>
              <p className="mt-1 text-sm text-muted">{r.text}</p>
            </div>
          );
        })}
      </section>

      <div className="mt-8 flex flex-col gap-3">
        {!isMember && (
          <button
            disabled={requested}
            onClick={() => requestJoin(group.id)}
            className="rounded-full bg-forest py-3 text-white disabled:opacity-50"
          >
            {requested ? "Join request sent" : "Join Request"}
          </button>
        )}
        {isMember && (
          <Link href={`/app/trips/${group.id}`} className="rounded-full bg-forest py-3 text-center text-white">
            Open group
          </Link>
        )}
        <button onClick={() => saveTrip(trip.id)} className="rounded-full border border-line py-3">
          {saved ? "Unsave trip" : "Save trip"}
        </button>
      </div>
    </main>
  );
}
