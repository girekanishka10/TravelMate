"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { VerifiedBadge } from "@/components/Ui";
import { ageFromDob } from "@/lib/format";
import { useApp } from "@/lib/store";

export default function ProfilePage() {
  const { currentUser, logout, updateProfile } = useApp();
  const router = useRouter();
  const [bio, setBio] = useState(currentUser?.bio ?? "");
  const [emergencyName, setEmergencyName] = useState(currentUser?.emergencyContact?.name ?? "");
  const [emergencyPhone, setEmergencyPhone] = useState(currentUser?.emergencyContact?.phone ?? "");
  if (!currentUser) return null;
  const p = currentUser.travelPersonality;

  return (
    <main className="mx-auto max-w-xl px-5 py-6">
      <div className="overflow-hidden rounded-[1.8rem] bg-card tm-shadow">
        <img src={currentUser.profilePhoto} alt="" className="h-52 w-full object-cover" />
        <div className="p-5">
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-3xl">{currentUser.name}</h1>
            {currentUser.verificationStatus === "verified" && <VerifiedBadge />}
          </div>
          <p className="text-muted">
            {ageFromDob(currentUser.dateOfBirth)} · {currentUser.city}
          </p>
          <p className="mt-2 text-sm">
            {p?.emoji} {p?.title}
          </p>
        </div>
      </div>

      {p && (
        <section className="mt-6 space-y-2">
          {Object.entries(p.scores).map(([k, v]) => (
            <div key={k}>
              <div className="mb-1 flex justify-between text-sm capitalize">
                <span>{k}</span>
                <span>{v}%</span>
              </div>
              <div className="h-2 rounded-full bg-sand">
                <div className="h-full rounded-full bg-forest" style={{ width: `${v}%` }} />
              </div>
            </div>
          ))}
        </section>
      )}

      <label className="mt-6 block text-sm">
        Bio
        <textarea className="mt-1 w-full rounded-2xl border border-line bg-card p-3" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
      </label>
      <label className="mt-3 block text-sm">
        Emergency contact name
        <input className="mt-1 w-full rounded-2xl border border-line bg-card px-4 py-3" value={emergencyName} onChange={(e) => setEmergencyName(e.target.value)} />
      </label>
      <label className="mt-3 block text-sm">
        Emergency contact phone
        <input className="mt-1 w-full rounded-2xl border border-line bg-card px-4 py-3" value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} />
      </label>
      <button
        className="mt-3 w-full rounded-full bg-forest py-3 text-white"
        onClick={() => updateProfile({ bio, emergencyContact: { name: emergencyName, phone: emergencyPhone } })}
      >
        Save profile
      </button>
      <p className="mt-2 text-xs text-muted">Emergency details stay private. Public profiles never show ID documents.</p>

      <div className="mt-6 grid gap-2">
        <Link href="/quiz" className="rounded-full border border-line py-3 text-center">
          Retake compatibility test
        </Link>
        <Link href="/app/safety" className="rounded-full border border-line py-3 text-center">
          Safety centre
        </Link>
        <Link href="/app/invites" className="rounded-full border border-line py-3 text-center">
          Invitations
        </Link>
        <button
          className="rounded-full py-3 text-clay"
          onClick={() => {
            logout();
            router.push("/");
          }}
        >
          Log out
        </button>
      </div>
    </main>
  );
}
