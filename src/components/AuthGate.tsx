"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";

export function AuthGate({
  children,
  needQuiz = false,
}: {
  children: React.ReactNode;
  needQuiz?: boolean;
}) {
  const { currentUser, hydrated } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;
    if (!currentUser) {
      router.replace("/login");
      return;
    }
    if (currentUser.verificationStatus !== "verified") {
      router.replace("/verify");
      return;
    }
    if (needQuiz && !currentUser.compatibilityAnswers) {
      router.replace("/quiz");
    }
  }, [hydrated, currentUser, needQuiz, router]);

  if (!hydrated || !currentUser) {
    return <div className="p-8 text-muted">Loading TravelMate…</div>;
  }
  if (needQuiz && !currentUser.compatibilityAnswers) {
    return <div className="p-8 text-muted">Finish your compatibility test to continue.</div>;
  }
  return <>{children}</>;
}
