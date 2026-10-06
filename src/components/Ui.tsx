import { ACTIVITY_OPTIONS } from "@/lib/quiz";

export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-sand px-2.5 py-1 text-xs text-ink">
      {children}
    </span>
  );
}

export function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-forest/10 px-2 py-0.5 text-xs font-medium text-forest">
      ✓ Verified
    </span>
  );
}

export function ActivityChips({ ids }: { ids: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {ids.map((id) => {
        const a = ACTIVITY_OPTIONS.find((x) => x.id === id);
        return (
          <Badge key={id}>
            {a ? `${a.emoji} ${a.label}` : id}
          </Badge>
        );
      })}
    </div>
  );
}

export function Stars({ value }: { value: number }) {
  return (
    <span className="text-sm">
      ⭐ {value.toFixed(1)}/5
    </span>
  );
}
