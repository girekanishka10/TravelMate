"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ActivityChips } from "@/components/Ui";
import { formatDateRange, formatINR } from "@/lib/format";
import { useApp } from "@/lib/store";
import type { ExploreFilters } from "@/lib/types";

export default function ExplorePage() {
  const { exploreTrips } = useApp();
  const [filters, setFilters] = useState<ExploreFilters>({
    destination: "",
    startDate: "",
    endDate: "",
    startingLocation: "",
    budgetMin: 0,
    budgetMax: 40000,
    groupSize: 1,
    travelStyle: "any",
  });
  const [submitted, setSubmitted] = useState(false);

  const results = useMemo(() => exploreTrips(submitted ? filters : {}), [exploreTrips, filters, submitted]);

  return (
    <main className="mx-auto max-w-3xl px-5 py-6">
      <h1 className="font-serif text-4xl">Explore groups</h1>
      <p className="mt-2 text-sm text-muted">Tell us the trip you want. We’ll rank groups by dates, budget and compatibility.</p>
      <form
        className="mt-6 space-y-3 rounded-[1.6rem] bg-card p-5 tm-shadow"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
      >
        <Field label="Where are you going?">
          <input
            placeholder="Destination"
            value={filters.destination}
            onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
            className="w-full rounded-2xl border border-line bg-paper px-4 py-3"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Start date">
            <input type="date" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} className="w-full rounded-2xl border border-line bg-paper px-4 py-3" />
          </Field>
          <Field label="End date">
            <input type="date" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} className="w-full rounded-2xl border border-line bg-paper px-4 py-3" />
          </Field>
        </div>
        <Field label="Starting location">
          <input placeholder="City" value={filters.startingLocation} onChange={(e) => setFilters({ ...filters, startingLocation: e.target.value })} className="w-full rounded-2xl border border-line bg-paper px-4 py-3" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Budget min">
            <input type="number" value={filters.budgetMin} onChange={(e) => setFilters({ ...filters, budgetMin: Number(e.target.value) })} className="w-full rounded-2xl border border-line bg-paper px-4 py-3" />
          </Field>
          <Field label="Budget max">
            <input type="number" value={filters.budgetMax} onChange={(e) => setFilters({ ...filters, budgetMax: Number(e.target.value) })} className="w-full rounded-2xl border border-line bg-paper px-4 py-3" />
          </Field>
        </div>
        <Field label="Preferred group size">
          <input type="number" min={1} value={filters.groupSize} onChange={(e) => setFilters({ ...filters, groupSize: Number(e.target.value) })} className="w-full rounded-2xl border border-line bg-paper px-4 py-3" />
        </Field>
        <Field label="Travel style">
          <select value={filters.travelStyle} onChange={(e) => setFilters({ ...filters, travelStyle: e.target.value })} className="w-full rounded-2xl border border-line bg-paper px-4 py-3">
            <option value="any">Any</option>
            {["adventure", "relaxing", "cultural", "party", "nature", "mixed"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <button className="w-full rounded-full bg-forest py-3 text-white">Find Compatible Groups</button>
      </form>

      <div className="mt-8 space-y-4">
        {results.map(({ trip, group, score }) => (
          <article key={trip.id} className="overflow-hidden rounded-[1.6rem] bg-card tm-shadow">
            <div className="h-36 bg-cover bg-center" style={{ backgroundImage: `url(${trip.photos[0]})` }} />
            <div className="p-5">
              <h2 className="font-serif text-2xl">{trip.destination} {capitalize(trip.travelStyle)} Group</h2>
              <p className="mt-2 text-sm text-muted">📅 {formatDateRange(trip.startDate, trip.endDate)}</p>
              <p className="text-sm text-muted">📍 {trip.startingLocation} → {trip.destination}</p>
              <p className="text-sm text-muted">💰 {formatINR(trip.budgetMin)}–{formatINR(trip.budgetMax)}</p>
              <p className="text-sm text-muted">👥 {group.memberIds.length}/{trip.groupSize} members</p>
              {score && <p className="mt-3 font-medium text-forest">Your compatibility: {score.overall}%</p>}
              <div className="mt-3">
                <p className="mb-1 text-xs text-muted">Common interests</p>
                <ActivityChips ids={trip.activities.slice(0, 4)} />
              </div>
              <Link href={`/app/explore/${trip.id}`} className="mt-4 inline-block rounded-full bg-ink px-5 py-2 text-sm text-white">
                View Group
              </Link>
            </div>
          </article>
        ))}
        {submitted && results.length === 0 && <p className="text-muted">No groups match those filters. Try a wider budget or destination.</p>}
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
