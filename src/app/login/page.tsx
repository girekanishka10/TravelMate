"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { DEMO_PASSWORD } from "@/lib/seed";
import { useApp } from "@/lib/store";

export default function LoginPage() {
  const { login } = useApp();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [identifier, setIdentifier] = useState("riya@travelmate.app");
  const [password, setPassword] = useState(DEMO_PASSWORD);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const err = login(identifier, password);
    if (err) {
      setError(err);
      return;
    }
    router.push("/app");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-10">
      <Link href="/" className="text-sm text-muted">
        ← Back
      </Link>
      <h1 className="mt-4 font-serif text-4xl">Welcome back</h1>
      <p className="mt-2 text-muted">Sign in to continue planning with compatible travellers.</p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <label className="block text-sm">
          Mobile number / Email
          <input
            className="mt-1 w-full rounded-2xl border border-line bg-card px-4 py-3"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
        </label>
        <label className="block text-sm">
          Password
          <input
            type="password"
            className="mt-1 w-full rounded-2xl border border-line bg-card px-4 py-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p className="text-sm text-clay">{error}</p>}
        <button type="submit" className="w-full rounded-full bg-forest py-3 text-white">
          Login
        </button>
      </form>
      <div className="mt-4 flex justify-between text-sm">
        <Link href="/forgot" className="text-muted">
          Forgot Password
        </Link>
        <Link href="/signup" className="text-forest">
          Create Account
        </Link>
      </div>
      <p className="mt-8 rounded-2xl bg-sand px-4 py-3 text-xs text-muted">
        Demo: <strong>riya@travelmate.app</strong> / <strong>{DEMO_PASSWORD}</strong>. Sample travellers use the same
        password.
      </p>
    </main>
  );
}
