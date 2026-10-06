"use client";

import { AuthGate } from "@/components/AuthGate";
import { BottomNav, SideNav } from "@/components/Nav";
import { useApp } from "@/lib/store";
import Link from "next/link";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { currentUser } = useApp();
  return (
    <AuthGate needQuiz>
      <div className="flex min-h-screen">
        <SideNav />
        <div className="flex min-h-screen flex-1 flex-col">
          <header className="hidden items-center justify-between border-b border-line px-8 py-4 md:flex">
            <p className="text-sm text-muted">Don’t just choose a destination. Choose the right people.</p>
            {currentUser && (
              <Link href="/app/profile" className="flex items-center gap-2 text-sm">
                <img src={currentUser.profilePhoto} alt="" className="h-8 w-8 rounded-full object-cover" />
                {currentUser.name}
              </Link>
            )}
          </header>
          <div className="flex-1 pb-24 md:pb-8">{children}</div>
        </div>
        <BottomNav />
      </div>
    </AuthGate>
  );
}
