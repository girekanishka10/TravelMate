import type {
  CompatibilityAnswers,
  CompatibilityBreakdown,
  Trip,
  User,
} from "./types";

const ACTIVITY_LABELS: Record<string, string> = {
  trekking: "trekking",
  camping: "camping",
  photography: "photography",
  shopping: "shopping",
  food: "food exploration",
  water: "water sports",
  nightlife: "nightlife",
  sightseeing: "sightseeing",
  wildlife: "wildlife",
  cultural: "cultural experiences",
};

function overlap(a: string[], b: string[]) {
  if (!a.length || !b.length) return 0;
  const set = new Set(b.map((x) => x.toLowerCase()));
  const hits = a.filter((x) => set.has(x.toLowerCase())).length;
  return hits / Math.max(a.length, b.length);
}

function closeness(a: number, b: number, span: number) {
  return 1 - Math.min(Math.abs(a - b) / span, 1);
}

function bandDistance(a: string, b: string, order: string[]) {
  const i = order.indexOf(a);
  const j = order.indexOf(b);
  if (i < 0 || j < 0) return 0.5;
  return 1 - Math.abs(i - j) / (order.length - 1);
}

function smokingScore(a: CompatibilityAnswers, b: CompatibilityAnswers) {
  if (a.smoking === "prefer-nonsmokers" && b.smoking === "yes") return 0.15;
  if (b.smoking === "prefer-nonsmokers" && a.smoking === "yes") return 0.15;
  if (a.smoking === b.smoking) return 1;
  if (a.smoking === "doesnt-matter" || b.smoking === "doesnt-matter") return 0.85;
  if ((a.smoking === "no" && b.smoking === "prefer-nonsmokers") || (b.smoking === "no" && a.smoking === "prefer-nonsmokers"))
    return 0.95;
  return 0.55;
}

function drinkingScore(a: CompatibilityAnswers, b: CompatibilityAnswers) {
  if (a.drinking === "prefer-nondrinkers" && b.drinking === "yes") return 0.2;
  if (b.drinking === "prefer-nondrinkers" && a.drinking === "yes") return 0.2;
  if (a.drinking === b.drinking) return 1;
  if ((a.drinking === "occasionally" && b.drinking !== "prefer-nondrinkers") || (b.drinking === "occasionally" && a.drinking !== "prefer-nondrinkers"))
    return 0.78;
  return 0.58;
}

export function compareAnswers(a: CompatibilityAnswers, b: CompatibilityAnswers): CompatibilityBreakdown {
  const personality =
    (closeness(a.adventure, b.adventure, 4) * 0.28 +
      closeness(a.social, b.social, 4) * 0.22 +
      (a.selfDescription === b.selfDescription ? 1 : 0.55) * 0.18 +
      (a.companion === b.companion || a.companion === "doesnt-matter" || b.companion === "doesnt-matter" ? 1 : 0.5) * 0.16 +
      (a.problems === b.problems ? 1 : 0.62) * 0.16) *
    100;

  const interests =
    ((a.terrain === b.terrain || a.terrain === "both" || b.terrain === "both" ? 1 : 0.35) * 0.3 +
      (a.tripType === b.tripType ? 1 : a.tripType === "mixed" || b.tripType === "mixed" ? 0.75 : 0.4) * 0.25 +
      overlap(a.food, b.food) * 0.2 +
      overlap(a.priorities.slice(0, 3), b.priorities.slice(0, 3)) * 0.25) *
    100;

  const budget = bandDistance(a.budget, b.budget, ["budget", "moderate", "comfortable", "luxury"]) * 100;

  const travelPace =
    (bandDistance(a.pace, b.pace, ["slow", "balanced", "fast"]) * 0.7 + closeness(a.flexibility, b.flexibility, 4) * 0.3) * 100;

  const activities =
    (overlap(a.activities, b.activities) * 0.72 +
      (a.accommodation === b.accommodation ? 1 : 0.55) * 0.28) *
    100;

  const socialStyle =
    (closeness(a.social, b.social, 4) * 0.35 +
      smokingScore(a, b) * 0.22 +
      drinkingScore(a, b) * 0.22 +
      closeness(a.cleanliness, b.cleanliness, 4) * 0.21) *
    100;

  const overall =
    personality * 0.2 +
    interests * 0.18 +
    budget * 0.14 +
    travelPace * 0.14 +
    activities * 0.18 +
    socialStyle * 0.16;

  const matches: string[] = [];
  const differences: string[] = [];

  if (a.terrain === b.terrain) {
    matches.push(a.terrain === "mountains" ? "Both love mountains" : a.terrain === "beaches" ? "Both love beaches" : "Both enjoy mountains and beaches");
  } else if (a.terrain === "both" || b.terrain === "both") {
    matches.push("Flexible on mountains vs beaches");
  } else {
    differences.push("Different landscape preferences: mountains vs beaches");
  }

  if (a.budget === b.budget) matches.push("Similar travel budget");
  else differences.push(`Budget bands differ (${labelBudget(a.budget)} vs ${labelBudget(b.budget)})`);

  if (a.pace === b.pace) matches.push("Similar travel pace");
  else differences.push("Different travel pace");

  const sharedActs = a.activities.filter((x) => b.activities.includes(x));
  sharedActs.slice(0, 3).forEach((act) => matches.push(`Both enjoy ${ACTIVITY_LABELS[act] ?? act}`));

  if (a.groupSizePref === b.groupSizePref && a.groupSizePref !== "doesnt-matter") {
    matches.push(
      a.groupSizePref === "small"
        ? "Both prefer small groups"
        : a.groupSizePref === "one"
          ? "Both prefer travelling with one person"
          : "Both are comfortable in large groups"
    );
  }

  if (a.tripType === b.tripType) matches.push(`Both lean toward ${a.tripType} trips`);

  if (a.accommodation !== b.accommodation) {
    differences.push(`You prefer ${a.accommodation}s while they prefer ${b.accommodation}s.`);
  } else {
    matches.push(`Same accommodation preference (${a.accommodation})`);
  }

  if (smokingScore(a, b) < 0.4) differences.push("Smoking preferences may clash");
  if (drinkingScore(a, b) < 0.4) differences.push("Drinking preferences may clash");
  if (Math.abs(a.cleanliness - b.cleanliness) >= 2) differences.push("Different cleanliness expectations");
  if (a.planning !== b.planning) differences.push("Different planning styles");
  else matches.push("Similar planning style");

  return {
    overall: roundPct(overall),
    personality: roundPct(personality),
    interests: roundPct(interests),
    budget: roundPct(budget),
    travelPace: roundPct(travelPace),
    activities: roundPct(activities),
    socialStyle: roundPct(socialStyle),
    matches: unique(matches).slice(0, 6),
    differences: unique(differences).slice(0, 4),
  };
}

export function compareUsers(me: User, other: User): CompatibilityBreakdown | null {
  if (!me.compatibilityAnswers || !other.compatibilityAnswers) return null;
  return compareAnswers(me.compatibilityAnswers, other.compatibilityAnswers);
}

export function compareUserToTrip(me: User, trip: Trip, creator?: User): CompatibilityBreakdown | null {
  if (!me.compatibilityAnswers) return null;
  const base = creator?.compatibilityAnswers
    ? compareAnswers(me.compatibilityAnswers, creator.compatibilityAnswers)
    : compareAnswers(me.compatibilityAnswers, me.compatibilityAnswers);

  const destBoost = me.compatibilityAnswers.terrain === "mountains" && /manali|ladakh|rishikesh|himachal|spiti/i.test(trip.destination)
    ? 4
    : me.compatibilityAnswers.terrain === "beaches" && /goa|kerala|andaman|gokarna/i.test(trip.destination)
      ? 4
      : 0;

  const styleBoost = me.compatibilityAnswers.tripType === trip.travelStyle ? 5 : trip.travelStyle === "mixed" ? 2 : 0;
  const activityBoost = overlap(me.compatibilityAnswers.activities, trip.activities) * 8;

  return {
    ...base,
    overall: roundPct(Math.min(99, base.overall + destBoost + styleBoost + activityBoost * 0.4)),
    activities: roundPct(Math.min(99, base.activities * 0.6 + overlap(me.compatibilityAnswers.activities, trip.activities) * 100 * 0.4)),
  };
}

export function tripMatchesFilters(
  trip: Trip,
  filters: {
    destination?: string;
    startDate?: string;
    endDate?: string;
    startingLocation?: string;
    budgetMin?: number;
    budgetMax?: number;
    groupSize?: number;
    travelStyle?: string;
  }
) {
  if (filters.destination && !trip.destination.toLowerCase().includes(filters.destination.toLowerCase())) {
    return false;
  }
  if (filters.startingLocation && !trip.startingLocation.toLowerCase().includes(filters.startingLocation.toLowerCase())) {
    return false;
  }
  if (filters.travelStyle && filters.travelStyle !== "any" && trip.travelStyle !== filters.travelStyle) {
    return false;
  }
  if (filters.budgetMin && trip.budgetMax < filters.budgetMin) return false;
  if (filters.budgetMax && trip.budgetMin > filters.budgetMax) return false;
  if (filters.groupSize && trip.groupSize < filters.groupSize) return false;
  if (filters.startDate && trip.endDate < filters.startDate) return false;
  if (filters.endDate && trip.startDate > filters.endDate) return false;
  return true;
}

function labelBudget(b: string) {
  return b.charAt(0).toUpperCase() + b.slice(1);
}

function roundPct(n: number) {
  return Math.max(12, Math.min(99, Math.round(n)));
}

function unique(arr: string[]) {
  return [...new Set(arr)];
}
