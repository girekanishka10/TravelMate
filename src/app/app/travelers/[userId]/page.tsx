"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Breakdown } from "@/components/Compatibility";
import { ActivityChips, Stars, VerifiedBadge } from "@/components/Ui";
import { ageFromDob, formatDateRange } from "@/lib/format";
import { useApp } from "@/lib/store";

export default function TravelerProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const { users, trips, reviews, currentUser, compatibilityWith, canReview, addReview, blockUser, reportUser } = useApp();
  const user = users.find((u) => u.id === userId);
  const me = currentUser;
  const [reportOpen, setReportOpen] = useState(false);
  const [reason, setReason] = useState("Inappropriate behaviour");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTrip, setReviewTrip] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  if (!user || !me) return <main className="p-8">Traveller not found.</main>;
  if (me.blockedUserIds.includes(user.id)) return <main className="p-8">You blocked this traveller.</main>;

  const score = compatibilityWith(user.id);
  const userReviews = reviews.filter((r) => r.reviewedUserId === user.id && !r.isGuideReview && r.verifiedTrip);
  const avg =
    userReviews.length > 0 ? userReviews.reduce((s, r) => s + r.rating, 0) / userReviews.length : user.rating;
  const completedTogether = trips.filter(
    (t) => t.status === "completed" && canReview(me.id, user.id, t.id)
  );

  return (
    <main className="mx-auto max-w-3xl px-5 py-6">
      <div className="overflow-hidden rounded-[1.8rem] bg-card tm-shadow">
        <img src={user.profilePhoto} alt="" className="h-64 w-full object-cover" />
        <div className="p-5">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-serif text-4xl">
              {user.name.split(" ")[0]}, {ageFromDob(user.dateOfBirth)}
            </h1>
            {user.verificationStatus === "verified" && <VerifiedBadge />}
          </div>
          <p className="text-muted">{user.city}</p>
          <p className="mt-3 text-sm leading-6">{user.bio}</p>
          <p className="mt-3">
            {user.travelPersonality?.emoji} {user.travelPersonality?.title}
          </p>
          <p className="mt-2 text-sm">
            <Stars value={avg || 0} /> — {userReviews.length} verified travel reviews · {user.completedTripCount} trips
          </p>
        </div>
      </div>

      {score && (
        <section className="mt-6 rounded-[1.6rem] bg-card p-5 tm-shadow">
          <Breakdown score={score} />
        </section>
      )}

      <section className="mt-6">
        <h2 className="font-serif text-2xl">Interests</h2>
        <div className="mt-3">
          <ActivityChips ids={user.compatibilityAnswers?.activities ?? []} />
        </div>
      </section>

      <section className="mt-6">
        <h2 className="font-serif text-2xl">Previous travel experience</h2>
        <div className="mt-3 space-y-4">
          {user.previousTrips.map((pt) => (
            <article key={pt.id} className="overflow-hidden rounded-3xl bg-card tm-shadow">
              <div className="grid grid-cols-2">
                {pt.photos.map((p) => (
                  <img key={p} src={p} alt="" className="h-28 w-full object-cover" />
                ))}
              </div>
              <div className="p-4">
                <h3 className="font-medium">
                  {pt.destination} — {pt.month}
                </h3>
                <p className="mt-1 text-sm text-muted">{pt.description}</p>
                <p className="mt-2 text-xs text-muted">{pt.activities.join(" · ")}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="font-serif text-2xl">Verified reviews</h2>
        <p className="mt-1 text-xs text-muted">Only people who completed the same trip can review.</p>
        {userReviews.map((r) => {
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

      {completedTogether.length > 0 && (
        <section className="mt-6 rounded-3xl bg-card p-4 tm-shadow">
          <h3 className="font-medium">Leave a verified review</h3>
          <select className="mt-2 w-full rounded-2xl border border-line px-3 py-2" value={reviewTrip} onChange={(e) => setReviewTrip(e.target.value)}>
            <option value="">Select completed trip</option>
            {completedTogether.map((t) => (
              <option key={t.id} value={t.id}>
                {t.destination} ({formatDateRange(t.startDate, t.endDate)})
              </option>
            ))}
          </select>
          <input type="range" min={1} max={5} value={reviewRating} onChange={(e) => setReviewRating(Number(e.target.value))} className="mt-3 w-full accent-forest" />
          <textarea className="mt-2 w-full rounded-2xl border border-line p-3" rows={3} value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="How was it travelling together?" />
          <button
            className="mt-2 rounded-full bg-forest px-4 py-2 text-sm text-white"
            onClick={() => {
              if (!reviewTrip) return;
              const err = addReview({
                reviewerId: me.id,
                reviewedUserId: user.id,
                tripId: reviewTrip,
                rating: reviewRating,
                text: reviewText,
              });
              setMsg(err ?? "Review submitted.");
            }}
          >
            Submit review
          </button>
          {msg && <p className="mt-2 text-sm text-muted">{msg}</p>}
        </section>
      )}

      <div className="mt-8 flex gap-3">
        <button onClick={() => setReportOpen(true)} className="flex-1 rounded-full border border-line py-3 text-sm">
          Report
        </button>
        <button
          onClick={() => blockUser(user.id)}
          className="flex-1 rounded-full border border-line py-3 text-sm"
        >
          Block
        </button>
      </div>
      <p className="mt-3 text-xs text-muted">Identity documents and verification tokens are never shown on public profiles.</p>

      {reportOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-5">
          <div className="w-full max-w-sm rounded-3xl bg-card p-5">
            <h3 className="font-serif text-2xl">Report traveller</h3>
            <select className="mt-3 w-full rounded-2xl border border-line px-3 py-2" value={reason} onChange={(e) => setReason(e.target.value)}>
              <option>Inappropriate behaviour</option>
              <option>Safety concern</option>
              <option>Spam</option>
              <option>Misleading trip details</option>
            </select>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 rounded-full border py-2" onClick={() => setReportOpen(false)}>
                Cancel
              </button>
              <button
                className="flex-1 rounded-full bg-clay py-2 text-white"
                onClick={() => {
                  reportUser(user.id, reason);
                  setReportOpen(false);
                }}
              >
                Report & block
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
