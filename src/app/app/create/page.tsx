"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ACTIVITY_OPTIONS } from "@/lib/quiz";
import { useApp } from "@/lib/store";

export default function CreateGroupPage() {
  const { createTrip, currentUser } = useApp();
  const router = useRouter();
  const [form, setForm] = useState({
    destination: "Manali",
    startingLocation: currentUser?.city ?? "",
    startDate: "2026-11-15",
    endDate: "2026-11-20",
    budgetMin: 12000,
    budgetMax: 15000,
    groupSize: 4,
    travelStyle: "adventure",
    accommodation: "hostel",
    description: "",
    activities: ["trekking", "camping", "sightseeing"] as string[],
  });

  function toggle(id: string) {
    setForm((f) => ({
      ...f,
      activities: f.activities.includes(id) ? f.activities.filter((x) => x !== id) : [...f.activities, id],
    }));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const { trip, group } = createTrip(form);
    router.push(`/app/discover?group=${group.id}&trip=${trip.id}`);
  }

  return (
    <main className="mx-auto max-w-xl px-5 py-6">
      <h1 className="font-serif text-4xl">Create Your Trip</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-3">
        {[
          ["destination", "Destination"],
          ["startingLocation", "Starting location"],
        ].map(([key, label]) => (
          <label key={key} className="block text-sm">
            {label}
            <input
              required
              className="mt-1 w-full rounded-2xl border border-line bg-card px-4 py-3"
              value={form[key as "destination"]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          </label>
        ))}
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm">
            Start date
            <input type="date" className="mt-1 w-full rounded-2xl border border-line bg-card px-4 py-3" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          </label>
          <label className="text-sm">
            End date
            <input type="date" className="mt-1 w-full rounded-2xl border border-line bg-card px-4 py-3" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
          </label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm">
            Budget min
            <input type="number" className="mt-1 w-full rounded-2xl border border-line bg-card px-4 py-3" value={form.budgetMin} onChange={(e) => setForm({ ...form, budgetMin: Number(e.target.value) })} />
          </label>
          <label className="text-sm">
            Budget max
            <input type="number" className="mt-1 w-full rounded-2xl border border-line bg-card px-4 py-3" value={form.budgetMax} onChange={(e) => setForm({ ...form, budgetMax: Number(e.target.value) })} />
          </label>
        </div>
        <label className="block text-sm">
          Number of people required
          <input type="number" min={2} className="mt-1 w-full rounded-2xl border border-line bg-card px-4 py-3" value={form.groupSize} onChange={(e) => setForm({ ...form, groupSize: Number(e.target.value) })} />
        </label>
        <label className="block text-sm">
          Travel style
          <select className="mt-1 w-full rounded-2xl border border-line bg-card px-4 py-3" value={form.travelStyle} onChange={(e) => setForm({ ...form, travelStyle: e.target.value })}>
            {["adventure", "relaxing", "cultural", "party", "nature", "mixed"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          Accommodation
          <select className="mt-1 w-full rounded-2xl border border-line bg-card px-4 py-3" value={form.accommodation} onChange={(e) => setForm({ ...form, accommodation: e.target.value })}>
            {["hostel", "hotel", "resort", "homestay", "camping"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <div>
          <p className="text-sm">Activities</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {ACTIVITY_OPTIONS.map((a) => (
              <button
                type="button"
                key={a.id}
                onClick={() => toggle(a.id)}
                className={`rounded-full px-3 py-1.5 text-sm ${form.activities.includes(a.id) ? "bg-forest text-white" : "bg-sand"}`}
              >
                {a.emoji} {a.label}
              </button>
            ))}
          </div>
        </div>
        <label className="block text-sm">
          Description
          <textarea className="mt-1 w-full rounded-2xl border border-line bg-card px-4 py-3" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </label>
        <div className="rounded-2xl bg-sand p-4 text-sm">
          <p><strong>Destination:</strong> {form.destination}</p>
          <p><strong>Dates:</strong> {form.startDate} → {form.endDate}</p>
          <p><strong>Budget:</strong> ₹{form.budgetMin.toLocaleString("en-IN")}–₹{form.budgetMax.toLocaleString("en-IN")}</p>
          <p><strong>Looking for:</strong> {Math.max(form.groupSize - 1, 1)} travellers</p>
        </div>
        <button className="w-full rounded-full bg-forest py-3 text-white">Find Travelers</button>
      </form>
    </main>
  );
}
