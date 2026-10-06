"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useApp } from "@/lib/store";
import type { Gender } from "@/lib/types";

export default function SignupPage() {
  const { signup } = useApp();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    dateOfBirth: "",
    gender: "prefer-not-to-say" as Gender,
    mobile: "",
    email: "",
    city: "",
    password: "",
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const err = signup({
      ...form,
      profilePhoto: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=800&q=80",
    });
    if (err) {
      setError(err);
      return;
    }
    router.push("/verify");
  }

  return (
    <main className="mx-auto max-w-md px-5 py-10">
      <Link href="/" className="text-sm text-muted">
        ← Back
      </Link>
      <h1 className="mt-4 font-serif text-4xl">Create your account</h1>
      <p className="mt-2 text-muted">We’ll verify identity next, then your travel compatibility test.</p>
      <form onSubmit={onSubmit} className="mt-8 space-y-3">
        {(
          [
            ["name", "Full Name", "text"],
            ["dateOfBirth", "Date of Birth", "date"],
            ["mobile", "Mobile Number", "tel"],
            ["email", "Email", "email"],
            ["city", "City", "text"],
            ["password", "Password", "password"],
          ] as const
        ).map(([key, label, type]) => (
          <label key={key} className="block text-sm">
            {label}
            <input
              type={type}
              required
              className="mt-1 w-full rounded-2xl border border-line bg-card px-4 py-3"
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          </label>
        ))}
        <label className="block text-sm">
          Gender
          <select
            className="mt-1 w-full rounded-2xl border border-line bg-card px-4 py-3"
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value as Gender })}
          >
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="non-binary">Non-binary</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </label>
        {error && <p className="text-sm text-clay">{error}</p>}
        <button type="submit" className="w-full rounded-full bg-forest py-3 text-white">
          Continue to verification
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-forest">
          Login
        </Link>
      </p>
    </main>
  );
}
