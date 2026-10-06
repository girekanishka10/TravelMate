"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Breakdown } from "@/components/Compatibility";
import { Stars, VerifiedBadge } from "@/components/Ui";
import { formatINR } from "@/lib/format";
import { guideCompatibility, useApp } from "@/lib/store";

function GuideInner() {
  const { guideId } = useParams<{ guideId: string }>();
  const search = useSearchParams();
  const { guides, reviews, users, trips, groups, currentUser, requestGuide, addReview, canReview } = useApp();
  const guide = guides.find((g) => g.id === guideId);
  const groupId = search.get("group") ?? groups.find((g) => g.memberIds.includes(currentUser?.id ?? ""))?.id;
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [tripId, setTripId] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  if (!guide || !currentUser) return <main className="p-8">Guide not found.</main>;
  const score = guideCompatibility(currentUser, guide);
  const greviews = reviews.filter((r) => r.reviewedUserId === guide.id && r.isGuideReview && r.verifiedTrip);
  const completed = trips.filter((t) => canReview(currentUser.id, guide.id, t.id, true));

  return (
    <main className="mx-auto max-w-3xl px-5 py-6">
      <div className="overflow-hidden rounded-[1.8rem] bg-card tm-shadow">
        <img src={guide.photo} alt="" className="h-64 w-full object-cover" />
        <div className="p-5">
          <h1 className="font-serif text-4xl">{guide.name}</h1>
          <VerifiedBadge />
          <p className="text-muted">📍 {guide.location}</p>
          <p className="mt-2">
            <Stars value={guide.rating} /> · {guide.verifiedTrips} verified trips · {guide.experienceYears} years
          </p>
          <p className="mt-3 text-sm leading-6">{guide.bio}</p>
          <p className="mt-3 text-sm">Languages: {guide.languages.join(" · ")}</p>
          <p className="text-sm">Specialties: {guide.specialties.join(" · ")}</p>
          <p className="text-sm">Areas: {guide.areasCovered.join(" · ")}</p>
          <p className="text-sm">Certifications: {guide.certifications.join(" · ")}</p>
          <p className="mt-2 font-medium">{formatINR(guide.pricePerDay)}/day</p>
          <p className="text-sm text-muted">{guide.availability}</p>
        </div>
      </div>

      {score && (
        <section className="mt-6 rounded-[1.6rem] bg-card p-5 tm-shadow">
          <Breakdown score={score} />
        </section>
      )}

      <section className="mt-6">
        <h2 className="font-serif text-2xl">Photos from trips</h2>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {guide.photos.map((p) => (
            <img key={p} src={p} alt="" className="h-32 w-full rounded-2xl object-cover" />
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="font-serif text-2xl">Verified reviews</h2>
        <p className="text-xs text-muted">Only travellers who completed a booked trip with this guide can review.</p>
        {greviews.map((r) => {
          const author = users.find((u) => u.id === r.reviewerId);
          const trip = trips.find((t) => t.id === r.tripId);
          return (
            <article key={r.id} className="mt-3 rounded-2xl bg-card p-4">
              <p className="text-sm font-medium">
                {author?.name} · {trip?.destination} · <Stars value={r.rating} />
              </p>
              <p className="mt-1 text-sm text-muted">{r.text}</p>
            </article>
          );
        })}
      </section>

      {completed.length > 0 && (
        <section className="mt-6 rounded-3xl bg-card p-4">
          <h3 className="font-medium">Leave a guide review</h3>
          <select className="mt-2 w-full rounded-2xl border px-3 py-2" value={tripId} onChange={(e) => setTripId(e.target.value)}>
            <option value="">Select trip</option>
            {completed.map((t) => (
              <option key={t.id} value={t.id}>
                {t.destination}
              </option>
            ))}
          </select>
          <input type="range" min={1} max={5} value={rating} onChange={(e) => setRating(Number(e.target.value))} className="mt-2 w-full accent-forest" />
          <textarea className="mt-2 w-full rounded-2xl border p-3" rows={3} value={text} onChange={(e) => setText(e.target.value)} />
          <button
            className="mt-2 rounded-full bg-forest px-4 py-2 text-sm text-white"
            onClick={() => {
              if (!tripId) return;
              const err = addReview({
                reviewerId: currentUser.id,
                reviewedUserId: guide.id,
                tripId,
                rating,
                text,
                isGuideReview: true,
              });
              setMsg(err ?? "Review submitted.");
            }}
          >
            Submit
          </button>
          {msg && <p className="mt-2 text-sm">{msg}</p>}
        </section>
      )}

      <button
        disabled={!groupId}
        onClick={() => groupId && requestGuide(groupId, guide.id)}
        className="mt-6 w-full rounded-full bg-forest py-3 text-white disabled:opacity-40"
      >
        Request Guide
      </button>
      {!groupId && (
        <p className="mt-2 text-center text-sm text-muted">
          <Link href="/app/create">Create a group</Link> to request this guide.
        </p>
      )}
    </main>
  );
}

export default function GuideProfilePage() {
  return (
    <Suspense fallback={<div className="p-8">Loading…</div>}>
      <GuideInner />
    </Suspense>
  );
}
