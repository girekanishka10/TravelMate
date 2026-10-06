export const ACTIVITY_OPTIONS = [
  { id: "trekking", label: "Trekking", emoji: "🥾" },
  { id: "camping", label: "Camping", emoji: "🏕️" },
  { id: "photography", label: "Photography", emoji: "📸" },
  { id: "shopping", label: "Shopping", emoji: "🛍️" },
  { id: "food", label: "Food exploration", emoji: "🍜" },
  { id: "water", label: "Water sports", emoji: "🏄" },
  { id: "nightlife", label: "Nightlife", emoji: "🌙" },
  { id: "sightseeing", label: "Sightseeing", emoji: "🏛️" },
  { id: "wildlife", label: "Wildlife", emoji: "🦌" },
  { id: "cultural", label: "Cultural experiences", emoji: "🎭" },
];

export const PRIORITY_OPTIONS = [
  "Safety",
  "Budget",
  "Comfort",
  "Adventure",
  "Food",
  "Experiences",
  "Nature",
  "Photography",
];

export const FOOD_OPTIONS = [
  "Local food",
  "Street food",
  "Vegetarian",
  "Non-vegetarian",
  "Healthy food",
  "Fine dining",
  "Anything",
];

export const RUINER_OPTIONS = [
  "Poor planning",
  "Overspending",
  "Too much partying",
  "Lack of cleanliness",
  "Too much walking",
  "Boring itinerary",
  "Arguments within group",
];

export type QuizKind = "single" | "multi" | "scale" | "rank";

export interface QuizQuestion {
  id: keyof import("./types").CompatibilityAnswers;
  title: string;
  subtitle?: string;
  kind: QuizKind;
  image: string;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "terrain",
    title: "Mountains or beaches?",
    subtitle: "Where do you feel most at home?",
    kind: "single",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=80",
    options: [
      { value: "mountains", label: "Mountains 🏔️" },
      { value: "beaches", label: "Beaches 🏖️" },
      { value: "both", label: "Both" },
    ],
  },
  {
    id: "chronotype",
    title: "Morning person or night person?",
    kind: "single",
    image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1400&q=80",
    options: [
      { value: "morning", label: "Morning 🌅" },
      { value: "night", label: "Night 🌙" },
      { value: "depends", label: "Depends on the trip" },
    ],
  },
  {
    id: "adventure",
    title: "How adventurous are you?",
    subtitle: "1 = easy-going · 5 = always pushing the plan",
    kind: "scale",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1400&q=80",
    min: 1,
    max: 5,
    minLabel: "Easy",
    maxLabel: "Bold",
  },
  {
    id: "smoking",
    title: "Do you smoke?",
    kind: "single",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=80",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "prefer-nonsmokers", label: "Prefer travelling with non-smokers" },
      { value: "doesnt-matter", label: "Doesn't matter" },
    ],
  },
  {
    id: "drinking",
    title: "Do you drink alcohol?",
    kind: "single",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1400&q=80",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "occasionally", label: "Occasionally" },
      { value: "prefer-nondrinkers", label: "Prefer travelling with people who don't drink" },
    ],
  },
  {
    id: "tripType",
    title: "What type of trip do you prefer?",
    kind: "single",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1400&q=80",
    options: [
      { value: "relaxing", label: "Relaxing" },
      { value: "adventure", label: "Adventure" },
      { value: "sightseeing", label: "Sightseeing" },
      { value: "party", label: "Party / social" },
      { value: "nature", label: "Nature" },
      { value: "cultural", label: "Cultural" },
      { value: "mixed", label: "Mixed" },
    ],
  },
  {
    id: "pace",
    title: "What is your preferred travel pace?",
    kind: "single",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1400&q=80",
    options: [
      { value: "slow", label: "Slow and relaxed" },
      { value: "balanced", label: "Balanced" },
      { value: "fast", label: "Fast — explore as much as possible" },
    ],
  },
  {
    id: "budget",
    title: "What is your approximate travel budget?",
    kind: "single",
    image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1400&q=80",
    options: [
      { value: "budget", label: "Budget" },
      { value: "moderate", label: "Moderate" },
      { value: "comfortable", label: "Comfortable" },
      { value: "luxury", label: "Luxury" },
    ],
  },
  {
    id: "social",
    title: "How social are you while travelling?",
    kind: "scale",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=80",
    min: 1,
    max: 5,
    minLabel: "Quiet",
    maxLabel: "Outgoing",
  },
  {
    id: "activities",
    title: "Which activities do you enjoy?",
    subtitle: "Select as many as you like",
    kind: "multi",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1400&q=80",
    options: ACTIVITY_OPTIONS.map((a) => ({ value: a.id, label: `${a.emoji} ${a.label}` })),
  },
  {
    id: "accommodation",
    title: "What type of accommodation do you prefer?",
    kind: "single",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80",
    options: [
      { value: "hostel", label: "Hostel" },
      { value: "hotel", label: "Hotel" },
      { value: "resort", label: "Resort" },
      { value: "homestay", label: "Homestay" },
      { value: "camping", label: "Camping" },
    ],
  },
  {
    id: "priorities",
    title: "What matters most during a trip?",
    subtitle: "Tap in order — first tap is most important",
    kind: "rank",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
    options: PRIORITY_OPTIONS.map((p) => ({ value: p, label: p })),
  },
  {
    id: "planning",
    title: "How do you usually plan trips?",
    kind: "single",
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1400&q=80",
    options: [
      { value: "detailed", label: "Detailed planning" },
      { value: "basic", label: "Basic planning" },
      { value: "spontaneous", label: "Mostly spontaneous" },
    ],
  },
  {
    id: "transport",
    title: "Road trip or flight?",
    kind: "single",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1400&q=80",
    options: [
      { value: "road", label: "Road trip 🚗" },
      { value: "flight", label: "Flight ✈️" },
      { value: "train", label: "Train 🚆" },
      { value: "depends", label: "Depends on distance" },
    ],
  },
  {
    id: "food",
    title: "What kind of food do you prefer?",
    subtitle: "Multiple selection",
    kind: "multi",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=80",
    options: FOOD_OPTIONS.map((f) => ({ value: f, label: f })),
  },
  {
    id: "cleanliness",
    title: "How important is cleanliness to you?",
    kind: "scale",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=80",
    min: 1,
    max: 5,
    minLabel: "Flexible",
    maxLabel: "Essential",
  },
  {
    id: "sharing",
    title: "How comfortable are you sharing accommodation?",
    kind: "single",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80",
    options: [
      { value: "very-comfortable", label: "Very comfortable" },
      { value: "comfortable", label: "Comfortable" },
      { value: "private-room", label: "Prefer private room" },
      { value: "never", label: "Never" },
    ],
  },
  {
    id: "problems",
    title: "How do you handle unexpected problems during travel?",
    kind: "single",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=80",
    options: [
      { value: "calm", label: "Stay calm and solve them" },
      { value: "ask-help", label: "Ask others for help" },
      { value: "stressed", label: "Get stressed" },
      { value: "depends", label: "Depends on situation" },
    ],
  },
  {
    id: "companion",
    title: "What type of travel companion do you prefer?",
    kind: "single",
    image: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1400&q=80",
    options: [
      { value: "quiet", label: "Quiet and peaceful" },
      { value: "social", label: "Social and talkative" },
      { value: "adventurous", label: "Adventurous" },
      { value: "organized", label: "Organized" },
      { value: "easygoing", label: "Easy-going" },
      { value: "doesnt-matter", label: "Doesn't matter" },
    ],
  },
  {
    id: "comfortVsExperience",
    title: "What is more important?",
    kind: "single",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80",
    options: [
      { value: "experience", label: "Experience over comfort" },
      { value: "comfort", label: "Comfort over experience" },
      { value: "balanced", label: "Balanced" },
    ],
  },
  {
    id: "groupSizePref",
    title: "Do you prefer travelling with:",
    kind: "single",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=80",
    options: [
      { value: "one", label: "One person" },
      { value: "small", label: "Small group" },
      { value: "large", label: "Large group" },
      { value: "doesnt-matter", label: "Doesn't matter" },
    ],
  },
  {
    id: "flexibility",
    title: "How flexible are you with travel plans?",
    kind: "scale",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1400&q=80",
    min: 1,
    max: 5,
    minLabel: "Fixed",
    maxLabel: "Go with it",
  },
  {
    id: "tripRuiners",
    title: "What would ruin a trip for you?",
    subtitle: "Select all that apply",
    kind: "multi",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80",
    options: RUINER_OPTIONS.map((r) => ({ value: r, label: r })),
  },
  {
    id: "selfDescription",
    title: "What describes you best?",
    kind: "single",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80",
    options: [
      { value: "Explorer", label: "Explorer" },
      { value: "Adventurer", label: "Adventurer" },
      { value: "Relaxer", label: "Relaxer" },
      { value: "Planner", label: "Planner" },
      { value: "Social traveller", label: "Social traveller" },
      { value: "Photographer", label: "Photographer" },
      { value: "Food explorer", label: "Food explorer" },
    ],
  },
];
