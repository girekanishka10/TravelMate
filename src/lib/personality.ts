import type { CompatibilityAnswers, TravelPersonality } from "./types";

export function buildPersonality(answers: CompatibilityAnswers): TravelPersonality {
  const adventure = clamp(
    Math.round(
      ((answers.adventure - 1) / 4) * 70 +
        (["adventure", "nature", "mixed"].includes(answers.tripType) ? 18 : 4) +
        (answers.comfortVsExperience === "experience" ? 12 : answers.comfortVsExperience === "balanced" ? 6 : 0)
    )
  );

  const social = clamp(
    Math.round(
      ((answers.social - 1) / 4) * 72 +
        (answers.companion === "social" || answers.tripType === "party" ? 18 : 6) +
        (answers.groupSizePref === "large" ? 10 : answers.groupSizePref === "small" ? 4 : 0)
    )
  );

  const planning = clamp(
    Math.round(
      (answers.planning === "detailed" ? 88 : answers.planning === "basic" ? 58 : 28) +
        (answers.priorities[0] === "Safety" ? 8 : 0) -
        ((answers.flexibility - 1) / 4) * 12
    )
  );

  const comfort = clamp(
    Math.round(
      (answers.budget === "luxury" ? 86 : answers.budget === "comfortable" ? 72 : answers.budget === "moderate" ? 52 : 32) +
        (answers.sharing === "never" || answers.sharing === "private-room" ? 12 : 0) +
        ((answers.cleanliness - 1) / 4) * 10 +
        (answers.comfortVsExperience === "comfort" ? 10 : 0)
    )
  );

  const spontaneity = clamp(
    Math.round(
      (answers.planning === "spontaneous" ? 86 : answers.planning === "basic" ? 62 : 34) +
        ((answers.flexibility - 1) / 4) * 18
    )
  );

  const descriptor = answers.selfDescription;
  const titleMap: Record<string, { title: string; emoji: string }> = {
    Explorer: { title: "Curious Explorer", emoji: "🧭" },
    Adventurer: { title: "Adventure Explorer", emoji: "🏔️" },
    Relaxer: { title: "Calm Wanderer", emoji: "🌿" },
    Planner: { title: "Thoughtful Planner", emoji: "🗺️" },
    "Social traveller": { title: "Social Trailblazer", emoji: "✨" },
    Photographer: { title: "Lens Wanderer", emoji: "📸" },
    "Food explorer": { title: "Culinary Explorer", emoji: "🍜" },
  };

  const fallback =
    adventure >= 75 && social >= 65
      ? { title: "Adventure Explorer", emoji: "🏔️" }
      : planning >= 75
        ? { title: "Thoughtful Planner", emoji: "🗺️" }
        : comfort >= 70
          ? { title: "Comfort Seeker", emoji: "🏡" }
          : { title: "Balanced Traveller", emoji: "✈️" };

  const picked = titleMap[descriptor] ?? fallback;

  return {
    title: picked.title,
    emoji: picked.emoji,
    scores: { adventure, social, planning, comfort, spontaneity },
  };
}

function clamp(n: number) {
  return Math.max(8, Math.min(99, n));
}
