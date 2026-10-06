"use client";

import Link from "next/link";

export default function ForgotPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5">
      <h1 className="font-serif text-4xl">Reset password</h1>
      <p className="mt-3 text-muted">
        This prototype does not send emails. Use the demo account <strong>riya@travelmate.app</strong> with password{" "}
        <strong>demo123</strong>, or create a new account.
      </p>
      <Link href="/login" className="mt-6 rounded-full bg-forest px-5 py-3 text-center text-white">
        Back to login
      </Link>
    </main>
  );
}
