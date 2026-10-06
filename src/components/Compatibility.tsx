import type { CompatibilityBreakdown } from "@/lib/types";

export function CompatibilityMeter({
  value,
  size = 72,
  label = "Compatible",
}: {
  value: number;
  size?: number;
  label?: string;
}) {
  const r = 28;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="flex items-center gap-3">
      <svg width={size} height={size} viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" stroke="#e7dcc8" strokeWidth="7" />
        <circle
          cx="36"
          cy="36"
          r={r}
          fill="none"
          stroke="#214c38"
          strokeWidth="7"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 36 36)"
        />
        <text x="36" y="41" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1e1a16">
          {value}%
        </text>
      </svg>
      <div>
        <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
        <p className="font-medium">{value >= 85 ? "Strong fit" : value >= 70 ? "Good fit" : "Partial fit"}</p>
      </div>
    </div>
  );
}

export function Breakdown({ score }: { score: CompatibilityBreakdown }) {
  const rows = [
    ["Personality", score.personality],
    ["Interests", score.interests],
    ["Budget", score.budget],
    ["Travel pace", score.travelPace],
    ["Activities", score.activities],
    ["Social style", score.socialStyle],
  ] as const;
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted">Overall compatibility</p>
        <p className="font-serif text-4xl">{score.overall}%</p>
      </div>
      <div className="space-y-2">
        {rows.map(([label, val]) => (
          <div key={label}>
            <div className="mb-1 flex justify-between text-sm">
              <span>{label}</span>
              <span className="text-muted">{val}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-sand">
              <div className="h-full rounded-full bg-forest" style={{ width: `${val}%` }} />
            </div>
          </div>
        ))}
      </div>
      {score.matches.length > 0 && (
        <div>
          <h4 className="mb-2 font-medium">Why you travel well together</h4>
          <ul className="space-y-1 text-sm">
            {score.matches.map((m) => (
              <li key={m} className="flex gap-2">
                <span className="text-leaf">✓</span>
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {score.differences.length > 0 && (
        <div>
          <h4 className="mb-2 font-medium">Possible differences</h4>
          <ul className="space-y-1 text-sm text-muted">
            {score.differences.map((m) => (
              <li key={m} className="flex gap-2">
                <span>⚠</span>
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
