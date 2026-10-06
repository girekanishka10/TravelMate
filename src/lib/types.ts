export type Gender = "female" | "male" | "non-binary" | "prefer-not-to-say";

export type Terrain = "mountains" | "beaches" | "both";
export type Chronotype = "morning" | "night" | "depends";
export type Smoking = "yes" | "no" | "prefer-nonsmokers" | "doesnt-matter";
export type Drinking = "yes" | "no" | "occasionally" | "prefer-nondrinkers";
export type TripType =
  | "relaxing"
  | "adventure"
  | "sightseeing"
  | "party"
  | "nature"
  | "cultural"
  | "mixed";
export type Pace = "slow" | "balanced" | "fast";
export type BudgetBand = "budget" | "moderate" | "comfortable" | "luxury";
export type Accommodation = "hostel" | "hotel" | "resort" | "homestay" | "camping";
export type Planning = "detailed" | "basic" | "spontaneous";
export type Transport = "road" | "flight" | "train" | "depends";
export type Sharing = "very-comfortable" | "comfortable" | "private-room" | "never";
export type ProblemStyle = "calm" | "ask-help" | "stressed" | "depends";
export type CompanionPref =
  | "quiet"
  | "social"
  | "adventurous"
  | "organized"
  | "easygoing"
  | "doesnt-matter";
export type ComfortVsExperience = "experience" | "comfort" | "balanced";
export type GroupSizePref = "one" | "small" | "large" | "doesnt-matter";

export interface CompatibilityAnswers {
  terrain: Terrain;
  chronotype: Chronotype;
  adventure: number;
  smoking: Smoking;
  drinking: Drinking;
  tripType: TripType;
  pace: Pace;
  budget: BudgetBand;
  social: number;
  activities: string[];
  accommodation: Accommodation;
  priorities: string[];
  planning: Planning;
  transport: Transport;
  food: string[];
  cleanliness: number;
  sharing: Sharing;
  problems: ProblemStyle;
  companion: CompanionPref;
  comfortVsExperience: ComfortVsExperience;
  groupSizePref: GroupSizePref;
  flexibility: number;
  tripRuiners: string[];
  selfDescription: string;
}

export interface PersonalityScores {
  adventure: number;
  social: number;
  planning: number;
  comfort: number;
  spontaneity: number;
}

export interface TravelPersonality {
  title: string;
  emoji: string;
  scores: PersonalityScores;
}

export interface PreviousTrip {
  id: string;
  destination: string;
  month: string;
  description: string;
  activities: string[];
  photos: string[];
}

export interface EmergencyContact {
  name: string;
  phone: string;
}

export interface User {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: Gender;
  city: string;
  email: string;
  mobile: string;
  password: string;
  verificationStatus: "unverified" | "verified";
  profilePhoto: string;
  bio: string;
  travelPersonality?: TravelPersonality;
  compatibilityAnswers?: CompatibilityAnswers;
  previousTrips: PreviousTrip[];
  completedTripIds: string[];
  rating: number;
  completedTripCount: number;
  emergencyContact?: EmergencyContact;
  blockedUserIds: string[];
  savedTripIds: string[];
  reportedUserIds: string[];
}

export interface ItineraryDay {
  day: string;
  title: string;
  details: string;
}

export type TripStatus = "planning" | "forming" | "confirmed" | "completed" | "cancelled";

export interface Trip {
  id: string;
  creatorId: string;
  destination: string;
  startDate: string;
  endDate: string;
  startingLocation: string;
  budgetMin: number;
  budgetMax: number;
  groupSize: number;
  activities: string[];
  travelStyle: TripType | string;
  accommodation: Accommodation | string;
  description: string;
  status: TripStatus;
  itinerary: ItineraryDay[];
  rules: string[];
  photos: string[];
  guideId?: string;
  emergencyInfo?: string;
}

export interface Group {
  id: string;
  tripId: string;
  creatorId: string;
  memberIds: string[];
  pendingInviteIds: string[];
  joinRequestIds: string[];
}

export interface Review {
  id: string;
  reviewerId: string;
  reviewedUserId: string;
  tripId: string;
  rating: number;
  text: string;
  verifiedTrip: boolean;
  isGuideReview?: boolean;
}

export interface Guide {
  id: string;
  name: string;
  photo: string;
  location: string;
  experienceYears: number;
  languages: string[];
  specialties: string[];
  pricePerDay: number;
  rating: number;
  verifiedTrips: number;
  availability: string;
  certifications: string[];
  areasCovered: string[];
  photos: string[];
  bio: string;
  answers: CompatibilityAnswers;
}

export interface Message {
  id: string;
  senderId: string;
  groupId: string;
  message: string;
  timestamp: string;
  type: "text" | "location" | "system" | "itinerary";
}

export interface Invitation {
  id: string;
  groupId: string;
  tripId: string;
  fromUserId: string;
  toUserId: string;
  status: "pending" | "accepted" | "declined";
}

export interface GuideRequest {
  id: string;
  groupId: string;
  tripId: string;
  guideId: string;
  fromUserId: string;
  status: "pending" | "accepted" | "declined";
}

export interface CompatibilityBreakdown {
  overall: number;
  personality: number;
  interests: number;
  budget: number;
  travelPace: number;
  activities: number;
  socialStyle: number;
  matches: string[];
  differences: string[];
}

export interface AppState {
  users: User[];
  trips: Trip[];
  groups: Group[];
  reviews: Review[];
  guides: Guide[];
  messages: Message[];
  invitations: Invitation[];
  guideRequests: GuideRequest[];
  currentUserId: string | null;
}

export interface ExploreFilters {
  destination: string;
  startDate: string;
  endDate: string;
  startingLocation: string;
  budgetMin: number;
  budgetMax: number;
  groupSize: number;
  travelStyle: string;
}
