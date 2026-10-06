"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/app", label: "Home", icon: HomeIcon },
  { href: "/app/explore", label: "Explore", icon: CompassIcon },
  { href: "/app/trips", label: "My Trips", icon: BagIcon },
  { href: "/app/messages", label: "Messages", icon: ChatIcon },
  { href: "/app/profile", label: "Profile", icon: UserIcon },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-line bg-card/95 backdrop-blur md:hidden">
      <ul className="mx-auto grid max-w-lg grid-cols-5 px-2 py-2">
        {items.map((item) => {
          const active = item.href === "/app" ? pathname === "/app" : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[11px] ${
                  active ? "text-forest" : "text-muted"
                }`}
              >
                <item.icon active={active} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function SideNav() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-56 shrink-0 border-r border-line bg-card p-4 md:flex md:flex-col">
      <Link href="/app" className="px-2 pb-6 font-serif text-2xl">
        TravelMate
      </Link>
      <ul className="space-y-1">
        {items.map((item) => {
          const active = item.href === "/app" ? pathname === "/app" : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm ${
                  active ? "bg-forest text-white" : "text-ink hover:bg-sand"
                }`}
              >
                <item.icon active={active} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

function HomeIcon({ active }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z" />
    </svg>
  );
}
function CompassIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="m16 8-2.2 6.2L8 16l2.2-6.2z" />
    </svg>
  );
}
function BagIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 8h12l1 12H5L6 8z" />
      <path d="M9 8V7a3 3 0 0 1 6 0v1" />
    </svg>
  );
}
function ChatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 18.5 4 21l3.2-1.2A9 9 0 1 0 5 18.5z" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 19.2a7 7 0 0 1 14 0" />
    </svg>
  );
}
