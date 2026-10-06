"use client";

import Link from "next/link";
import { ActivityChips, Badge, VerifiedBadge } from "@/components/Ui";
import { firstName, formatDateRange, formatINR } from "@/lib/format";
import { useApp } from "@/lib/store";

export default function HomePage() {
  const { currentUser, trips, groups, invitations, recommendedTravelers, exploreTrips } = useApp();
  if (!currentUser) return null;
  const recGroups = exploreTrips({}).slice(0, 3);
  const recPeople = recommendedTravelers().slice(0, 4);
  const upcoming = groups
    .filter((g) => g.memberIds.includes(currentUser.id))
    .map((g) => ({ g, trip: trips.find((t) => t.id === g.tripId)! }))
    .filter((x) => x.trip && x.trip.status !== "completed")
    .slice(0, 3);
  const saved = trips.filter((t) => currentUser.savedTripIds.includes(t.id));
  const pendingInvites = invitations.filter((i) => i.toUserId === currentUser.id && i.status === "pending");

  return (
    <main className="mx-auto max-w-5xl px-5 py-6">
      <p className="text-sm text-muted">TravelMate</p>
      <h1 className="font-serif text-4xl">Hi, {firstName(currentUser.name)}! 👋</h1>
      <p className="mt-2 text-muted">
        Your Travel Personality:{" "}
        <strong className="text-ink">
          {currentUser.travelPersonality?.emoji} {currentUser.travelPersonality?.title}
        </strong>
      </p>
      {currentUser.verificationStatus === "verified" && (
        <div className="mt-2">
          <VerifiedBadge />
        </div>
      )}

      {pendingInvites.length > 0 && (
        <Link href="/app/invites" className="mt-4 block rounded-2xl bg-sand px-4 py-3 text-sm">
          You have {pendingInvites.length} trip invitation{pendingInvites.length > 1 ? "s" : ""}. Review them →
        </Link>
      )}

      <section className="mt-6 grid gap-3 md:grid-cols-3">
        <BigLink href="/app/explore" title="Explore" body="Find existing groups." image="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=900&q=80" />
        <BigLink href="/app/create" title="Create your own group" body="Build your travel group." image="https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=900&q=80" />
        <BigLink href="/app/guides" title="Find a guide" body="For an existing group." image="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80" />
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-2xl">Recommended groups</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {recGroups.map(({ trip, score }) => (
            <Link key={trip.id} href={`/app/explore/${trip.id}`} className="overflow-hidden rounded-3xl bg-card tm-shadow">
              <div className="h-28 bg-cover bg-center" style={{ backgroundImage: `url(${trip.photos[0]})` }} />
              <div className="p-4">
                <p className="font-medium">{trip.destination} {trip.travelStyle} group</p>
                <p className="mt-1 text-xs text-muted">
                  {formatDateRange(trip.startDate, trip.endDate)} · {formatINR(trip.budgetMin)}–{formatINR(trip.budgetMax)}
                </p>
                {score && <p className="mt-2 text-sm text-forest">{score.overall}% compatibility</p>}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-2xl">Recommended travellers</h2>
        <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
          {recPeople.map(({ user, score }) => (
            <Link key={user.id} href={`/app/travelers/${user.id}`} className="w-40 shrink-0 rounded-3xl bg-card p-3 tm-shadow">
              <img src={user.profilePhoto} alt="" className="h-28 w-full rounded-2xl object-cover" />
              <p className="mt-2 font-medium">{firstName(user.name)}</p>
              <p className="text-xs text-muted">{user.city}</p>
              <p className="mt-1 text-sm text-forest">{score.overall}%</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-2xl">Upcoming trips</h2>
        <div className="mt-3 space-y-2">
          {upcoming.length === 0 && <p className="text-sm text-muted">No upcoming trips yet. Explore or create a group.</p>}
          {upcoming.map(({ g, trip }) => (
            <Link key={g.id} href={`/app/trips/${g.id}`} className="flex items-center justify-between rounded-2xl bg-card px-4 py-3 tm-shadow">
              <div>
                <p className="font-medium">{trip.destination}</p>
                <p className="text-xs text-muted">{formatDateRange(trip.startDate, trip.endDate)}</p>
              </div>
              <Badge>{g.memberIds.length}/{trip.groupSize}</Badge>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-2xl">Saved trips</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {saved.length === 0 && <p className="text-sm text-muted">Save trips from Explore to find them here.</p>}
          {saved.map((t) => (
            <Link key={t.id} href={`/app/explore/${t.id}`} className="rounded-full bg-sand px-4 py-2 text-sm">
              {t.destination}
            </Link>
          ))}
        </div>
        <div className="mt-6">
          <ActivityChips ids={currentUser.compatibilityAnswers?.activities ?? []} />
        </div>
      </section>
    </main>
  );
}

function BigLink({ href, title, body, image }: { href: string; title: string; body: string; image: string }) {
  return (
    <Link href={href} className="relative min-h-[160px] overflow-hidden rounded-[1.6rem]">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
      <div className="relative flex h-full flex-col justify-end p-5 text-white">
        <h2 className="font-serif text-2xl uppercase">{title}</h2>
        <p className="text-sm text-white/80">{body}</p>
      </div>
    </Link>
  );
}
