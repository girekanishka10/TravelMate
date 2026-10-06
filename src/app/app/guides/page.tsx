"use client";

import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { VerifiedBadge } from "@/components/Ui";
import { formatINR } from "@/lib/format";
import { guideCompatibility, useApp } from "@/lib/store";

function GuidesInner() {
  const params = useSearchParams();
  const { guides, groups, trips, currentUser, requestGuide } = useApp();
  const groupId = params.get("group") ?? groups.find((g) => g.memberIds.includes(currentUser?.id ?? ""))?.id ?? "";
  const group = groups.find((g) => g.id === groupId);
  const trip = trips.find((t) => t.id === group?.tripId);
  const [form, setForm] = useState({
    destination: trip?.destination ?? "",
    people: trip?.groupSize ?? 4,
    type: "Trekking",
    languages: "English",
    activities: trip?.activities.join(", ") ?? "",
    budget: trip?.budgetMax ?? 15000,
    experience: 3,
  });
  const [searched, setSearched] = useState(Boolean(trip));

  const myGroups = groups.filter((g) => g.creatorId === currentUser?.id || g.memberIds.includes(currentUser?.id ?? ""));

  const results = useMemo(() => {
    if (!searched) return [];
    return guides
      .filter((g) => !form.destination || g.location.toLowerCase().includes(form.destination.toLowerCase()) || g.areasCovered.some((a) => a.toLowerCase().includes(form.destination.toLowerCase())))
      .filter((g) => g.experienceYears >= form.experience)
      .filter((g) => g.pricePerDay * Math.max(form.people, 1) / 4 <= form.budget || g.pricePerDay <= 4000)
      .map((g) => ({ g, score: guideCompatibility(currentUser, g) }))
      .sort((a, b) => (b.score?.overall ?? 0) - (a.score?.overall ?? 0));
  }, [guides, form, searched, currentUser]);

  return (
    <main className="mx-auto max-w-3xl px-5 py-6">
      <h1 className="font-serif text-4xl">Find a Guide</h1>
      <p className="mt-2 text-sm text-muted">Best used when you already have a group. Guides are ranked by trip compatibility, destination and experience.</p>

      {myGroups.length === 0 && (
        <p className="mt-4 rounded-2xl bg-sand p-4 text-sm">Create or join a group first so a guide can be attached to a real trip.</p>
      )}

      <form
        className="mt-5 space-y-3 rounded-[1.6rem] bg-card p-5 tm-shadow"
        onSubmit={(e) => {
          e.preventDefault();
          setSearched(true);
        }}
      >
        <label className="block text-sm">
          Attach to group
          <select
            className="mt-1 w-full rounded-2xl border border-line px-4 py-3"
            value={groupId}
            onChange={(e) => {
              const g = groups.find((x) => x.id === e.target.value);
              const t = trips.find((x) => x.id === g?.tripId);
              if (t) setForm((f) => ({ ...f, destination: t.destination, people: t.groupSize }));
              window.history.replaceState(null, "", `/app/guides?group=${e.target.value}`);
            }}
          >
            <option value="">Select group</option>
            {myGroups.map((g) => {
              const t = trips.find((x) => x.id === g.tripId);
              return (
                <option key={g.id} value={g.id}>
                  {t?.destination}
                </option>
              );
            })}
          </select>
        </label>
        <label className="block text-sm">
          Destination
          <input className="mt-1 w-full rounded-2xl border border-line px-4 py-3" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm">
            Number of people
            <input type="number" className="mt-1 w-full rounded-2xl border border-line px-4 py-3" value={form.people} onChange={(e) => setForm({ ...form, people: Number(e.target.value) })} />
          </label>
          <label className="text-sm">
            Experience (years)
            <input type="number" className="mt-1 w-full rounded-2xl border border-line px-4 py-3" value={form.experience} onChange={(e) => setForm({ ...form, experience: Number(e.target.value) })} />
          </label>
        </div>
        <label className="block text-sm">
          Required guide type
          <input className="mt-1 w-full rounded-2xl border border-line px-4 py-3" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
        </label>
        <label className="block text-sm">
          Languages
          <input className="mt-1 w-full rounded-2xl border border-line px-4 py-3" value={form.languages} onChange={(e) => setForm({ ...form, languages: e.target.value })} />
        </label>
        <label className="block text-sm">
          Activities
          <input className="mt-1 w-full rounded-2xl border border-line px-4 py-3" value={form.activities} onChange={(e) => setForm({ ...form, activities: e.target.value })} />
        </label>
        <label className="block text-sm">
          Budget (trip)
          <input type="number" className="mt-1 w-full rounded-2xl border border-line px-4 py-3" value={form.budget} onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })} />
        </label>
        <button className="w-full rounded-full bg-forest py-3 text-white">Search guides</button>
      </form>

      <div className="mt-6 space-y-4">
        {results.map(({ g, score }) => (
          <article key={g.id} className="rounded-[1.6rem] bg-card p-4 tm-shadow">
            <div className="flex gap-4">
              <img src={g.photo} alt="" className="h-24 w-24 rounded-2xl object-cover" />
              <div className="flex-1">
                <h2 className="font-serif text-2xl">{g.name}</h2>
                <VerifiedBadge />
                <p className="text-sm text-muted">📍 {g.location}</p>
                <p className="text-sm">⭐ {g.rating}/5 · {g.verifiedTrips} verified trips</p>
                <p className="text-sm">Languages: {g.languages.join(" · ")}</p>
                <p className="text-sm">Specialties: {g.specialties.join(" · ")}</p>
                <p className="text-sm">{g.experienceYears} years · {formatINR(g.pricePerDay)}/day</p>
                {score && <p className="mt-1 font-medium text-forest">{score.overall}% Trip Compatibility</p>}
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Link href={`/app/guides/${g.id}${group ? `?group=${group.id}` : ""}`} className="flex-1 rounded-full border py-2 text-center text-sm">
                View Profile
              </Link>
              <button
                disabled={!group}
                onClick={() => group && requestGuide(group.id, g.id)}
                className="flex-1 rounded-full bg-forest py-2 text-sm text-white disabled:opacity-40"
              >
                Request Guide
              </button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

export default function GuidesPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading guides…</div>}>
      <GuidesInner />
    </Suspense>
  );
}
