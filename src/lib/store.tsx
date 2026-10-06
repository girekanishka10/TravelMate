"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { compareAnswers, compareUserToTrip, compareUsers, tripMatchesFilters } from "./compatibility";
import { uid } from "./format";
import { buildPersonality } from "./personality";
import { createSeedState } from "./seed";
import type {
  AppState,
  CompatibilityAnswers,
  CompatibilityBreakdown,
  ExploreFilters,
  Guide,
  Group,
  Message,
  Review,
  Trip,
  User,
} from "./types";

const STORAGE_KEY = "travelmate.v1";

type Store = AppState & {
  hydrated: boolean;
  currentUser: User | null;
  login: (identifier: string, password: string) => string | null;
  logout: () => void;
  signup: (input: Omit<User, "id" | "verificationStatus" | "previousTrips" | "completedTripIds" | "rating" | "completedTripCount" | "blockedUserIds" | "savedTripIds" | "reportedUserIds" | "bio">) => string | null;
  verifyCurrentUser: () => void;
  completeQuiz: (answers: CompatibilityAnswers) => void;
  updateProfile: (patch: Partial<User>) => void;
  saveTrip: (tripId: string) => void;
  createTrip: (input: Omit<Trip, "id" | "creatorId" | "status" | "itinerary" | "rules" | "photos"> & { itinerary?: Trip["itinerary"]; rules?: string[] }) => { trip: Trip; group: Group };
  inviteTraveler: (groupId: string, userId: string) => void;
  respondInvite: (invitationId: string, accept: boolean) => void;
  requestJoin: (groupId: string) => void;
  respondJoin: (groupId: string, userId: string, accept: boolean) => void;
  removeMember: (groupId: string, userId: string) => void;
  updateTrip: (tripId: string, patch: Partial<Trip>) => void;
  sendMessage: (groupId: string, message: string, type?: Message["type"]) => void;
  requestGuide: (groupId: string, guideId: string) => void;
  assignGuide: (tripId: string, guideId: string) => void;
  addReview: (input: Omit<Review, "id" | "verifiedTrip">) => string | null;
  blockUser: (userId: string) => void;
  reportUser: (userId: string, reason: string) => void;
  canReview: (reviewerId: string, reviewedId: string, tripId: string, isGuide?: boolean) => boolean;
  compatibilityWith: (userId: string) => CompatibilityBreakdown | null;
  compatibilityWithTrip: (tripId: string) => CompatibilityBreakdown | null;
  exploreTrips: (filters: Partial<ExploreFilters>) => { trip: Trip; group: Group; score: CompatibilityBreakdown | null }[];
  recommendedTravelers: () => { user: User; score: CompatibilityBreakdown }[];
};

const Ctx = createContext<Store | null>(null);

function loadState(): AppState {
  if (typeof window === "undefined") return createSeedState();
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return createSeedState();
  try {
    const parsed = JSON.parse(raw) as AppState;
    if (!parsed.users?.length) return createSeedState();
    return parsed;
  } catch {
    return createSeedState();
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(createSeedState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const currentUser = useMemo(
    () => state.users.find((u) => u.id === state.currentUserId) ?? null,
    [state.users, state.currentUserId]
  );

  const login = useCallback((identifier: string, password: string) => {
    const id = identifier.trim().toLowerCase();
    const user = state.users.find(
      (u) => (u.email.toLowerCase() === id || u.mobile === identifier.trim()) && u.password === password
    );
    if (!user) return "Check your mobile/email and password.";
    setState((s) => ({ ...s, currentUserId: user.id }));
    return null;
  }, [state.users]);

  const logout = useCallback(() => {
    setState((s) => ({ ...s, currentUserId: null }));
  }, []);

  const signup = useCallback((input: Parameters<Store["signup"]>[0]) => {
    const exists = state.users.some(
      (u) => u.email.toLowerCase() === input.email.toLowerCase() || u.mobile === input.mobile
    );
    if (exists) return "An account with this email or mobile already exists.";
    const id = uid("u");
    const user: User = {
      ...input,
      id,
      verificationStatus: "unverified",
      previousTrips: [],
      completedTripIds: [],
      rating: 0,
      completedTripCount: 0,
      blockedUserIds: [],
      savedTripIds: [],
      reportedUserIds: [],
      bio: "New on TravelMate. Completing the travel compatibility test.",
    };
    setState((s) => ({ ...s, users: [...s.users, user], currentUserId: id }));
    return null;
  }, [state.users]);

  const verifyCurrentUser = useCallback(() => {
    if (!state.currentUserId) return;
    setState((s) => ({
      ...s,
      users: s.users.map((u) => (u.id === s.currentUserId ? { ...u, verificationStatus: "verified" } : u)),
    }));
  }, [state.currentUserId]);

  const completeQuiz = useCallback((answers: CompatibilityAnswers) => {
    setState((s) => ({
      ...s,
      users: s.users.map((u) =>
        u.id === s.currentUserId
          ? { ...u, compatibilityAnswers: answers, travelPersonality: buildPersonality(answers) }
          : u
      ),
    }));
  }, []);

  const updateProfile = useCallback((patch: Partial<User>) => {
    setState((s) => ({
      ...s,
      users: s.users.map((u) => (u.id === s.currentUserId ? { ...u, ...patch, id: u.id } : u)),
    }));
  }, []);

  const saveTrip = useCallback((tripId: string) => {
    setState((s) => ({
      ...s,
      users: s.users.map((u) => {
        if (u.id !== s.currentUserId) return u;
        const saved = u.savedTripIds.includes(tripId)
          ? u.savedTripIds.filter((id) => id !== tripId)
          : [...u.savedTripIds, tripId];
        return { ...u, savedTripIds: saved };
      }),
    }));
  }, []);

  const createTrip = useCallback((input: Parameters<Store["createTrip"]>[0]) => {
    const trip: Trip = {
      itinerary: input.itinerary ?? [
        { day: "Day 1", title: "Arrive", details: "Travel and settle in." },
        { day: "Last day", title: "Return", details: "Checkout and head home." },
      ],
      rules: input.rules ?? ["Split costs fairly", "Be on time", "Share location during travel days"],
      photos: [
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1400&q=80",
      ],
      ...input,
      id: uid("t"),
      creatorId: state.currentUserId!,
      status: "planning",
    };
    const group: Group = {
      id: uid("g"),
      tripId: trip.id,
      creatorId: state.currentUserId!,
      memberIds: [state.currentUserId!],
      pendingInviteIds: [],
      joinRequestIds: [],
    };
    setState((s) => ({ ...s, trips: [...s.trips, trip], groups: [...s.groups, group] }));
    return { trip, group };
  }, [state.currentUserId]);

  const inviteTraveler = useCallback((groupId: string, userId: string) => {
    setState((s) => {
      const group = s.groups.find((g) => g.id === groupId);
      if (!group || !s.currentUserId) return s;
      if (group.memberIds.includes(userId) || group.pendingInviteIds.includes(userId)) return s;
      const invitation = {
        id: uid("inv"),
        groupId,
        tripId: group.tripId,
        fromUserId: s.currentUserId,
        toUserId: userId,
        status: "pending" as const,
      };
      return {
        ...s,
        groups: s.groups.map((g) =>
          g.id === groupId ? { ...g, pendingInviteIds: [...g.pendingInviteIds, userId] } : g
        ),
        invitations: [...s.invitations, invitation],
        trips: s.trips.map((t) => (t.id === group.tripId && t.status === "planning" ? { ...t, status: "forming" } : t)),
      };
    });
  }, []);

  const respondInvite = useCallback((invitationId: string, accept: boolean) => {
    setState((s) => {
      const inv = s.invitations.find((i) => i.id === invitationId);
      if (!inv) return s;
      return {
        ...s,
        invitations: s.invitations.map((i) =>
          i.id === invitationId ? { ...i, status: accept ? "accepted" : "declined" } : i
        ),
        groups: s.groups.map((g) => {
          if (g.id !== inv.groupId) return g;
          const pendingInviteIds = g.pendingInviteIds.filter((id) => id !== inv.toUserId);
          const memberIds = accept && !g.memberIds.includes(inv.toUserId) ? [...g.memberIds, inv.toUserId] : g.memberIds;
          return { ...g, pendingInviteIds, memberIds };
        }),
        messages: accept
          ? [
              ...s.messages,
              {
                id: uid("m"),
                senderId: "system",
                groupId: inv.groupId,
                message: `${s.users.find((u) => u.id === inv.toUserId)?.name ?? "A traveller"} joined the group.`,
                timestamp: new Date().toISOString(),
                type: "system" as const,
              },
            ]
          : s.messages,
      };
    });
  }, []);

  const requestJoin = useCallback((groupId: string) => {
    setState((s) => ({
      ...s,
      groups: s.groups.map((g) => {
        if (g.id !== groupId || !s.currentUserId) return g;
        if (g.memberIds.includes(s.currentUserId) || g.joinRequestIds.includes(s.currentUserId)) return g;
        return { ...g, joinRequestIds: [...g.joinRequestIds, s.currentUserId] };
      }),
    }));
  }, []);

  const respondJoin = useCallback((groupId: string, userId: string, accept: boolean) => {
    setState((s) => ({
      ...s,
      groups: s.groups.map((g) => {
        if (g.id !== groupId) return g;
        const joinRequestIds = g.joinRequestIds.filter((id) => id !== userId);
        const memberIds = accept && !g.memberIds.includes(userId) ? [...g.memberIds, userId] : g.memberIds;
        return { ...g, joinRequestIds, memberIds };
      }),
      messages: accept
        ? [
            ...s.messages,
            {
              id: uid("m"),
              senderId: "system",
              groupId,
              message: `${s.users.find((u) => u.id === userId)?.name ?? "A traveller"} was accepted into the group.`,
              timestamp: new Date().toISOString(),
              type: "system" as const,
            },
          ]
        : s.messages,
    }));
  }, []);

  const removeMember = useCallback((groupId: string, userId: string) => {
    setState((s) => ({
      ...s,
      groups: s.groups.map((g) =>
        g.id === groupId ? { ...g, memberIds: g.memberIds.filter((id) => id !== userId) } : g
      ),
    }));
  }, []);

  const updateTrip = useCallback((tripId: string, patch: Partial<Trip>) => {
    setState((s) => ({
      ...s,
      trips: s.trips.map((t) => (t.id === tripId ? { ...t, ...patch, id: t.id } : t)),
    }));
  }, []);

  const sendMessage = useCallback((groupId: string, message: string, type: Message["type"] = "text") => {
    if (!state.currentUserId || !message.trim()) return;
    const msg: Message = {
      id: uid("m"),
      senderId: type === "system" ? "system" : state.currentUserId,
      groupId,
      message: message.trim(),
      timestamp: new Date().toISOString(),
      type,
    };
    setState((s) => ({ ...s, messages: [...s.messages, msg] }));
  }, [state.currentUserId]);

  const requestGuide = useCallback((groupId: string, guideId: string) => {
    setState((s) => {
      const group = s.groups.find((g) => g.id === groupId);
      if (!group || !s.currentUserId) return s;
      return {
        ...s,
        guideRequests: [
          ...s.guideRequests,
          {
            id: uid("gr"),
            groupId,
            tripId: group.tripId,
            guideId,
            fromUserId: s.currentUserId,
            status: "pending",
          },
        ],
        trips: s.trips.map((t) => (t.id === group.tripId ? { ...t, guideId } : t)),
        messages: [
          ...s.messages,
          {
            id: uid("m"),
            senderId: "system",
            groupId,
            message: `Guide request sent to ${s.guides.find((g) => g.id === guideId)?.name ?? "a guide"}.`,
            timestamp: new Date().toISOString(),
            type: "system" as const,
          },
        ],
      };
    });
  }, []);

  const assignGuide = useCallback((tripId: string, guideId: string) => {
    setState((s) => ({
      ...s,
      trips: s.trips.map((t) => (t.id === tripId ? { ...t, guideId } : t)),
    }));
  }, []);

  const canReview = useCallback(
    (reviewerId: string, reviewedId: string, tripId: string, isGuide = false) => {
      const trip = state.trips.find((t) => t.id === tripId);
      const group = state.groups.find((g) => g.tripId === tripId);
      if (!trip || trip.status !== "completed") return false;
      if (isGuide) {
        return Boolean(group?.memberIds.includes(reviewerId) && trip.guideId === reviewedId);
      }
      return Boolean(group?.memberIds.includes(reviewerId) && group.memberIds.includes(reviewedId) && reviewerId !== reviewedId);
    },
    [state.trips, state.groups]
  );

  const addReview = useCallback((input: Omit<Review, "id" | "verifiedTrip">) => {
    if (!canReview(input.reviewerId, input.reviewedUserId, input.tripId, input.isGuideReview)) {
      return "Reviews are only allowed after a shared completed trip.";
    }
    const exists = state.reviews.some(
      (r) =>
        r.reviewerId === input.reviewerId &&
        r.reviewedUserId === input.reviewedUserId &&
        r.tripId === input.tripId
    );
    if (exists) return "You already reviewed this person for this trip.";
    const review: Review = { ...input, id: uid("r"), verifiedTrip: true };
    setState((s) => ({ ...s, reviews: [...s.reviews, review] }));
    return null;
  }, [canReview, state.reviews]);

  const blockUser = useCallback((userId: string) => {
    setState((s) => ({
      ...s,
      users: s.users.map((u) =>
        u.id === s.currentUserId ? { ...u, blockedUserIds: [...new Set([...u.blockedUserIds, userId])] } : u
      ),
    }));
  }, []);

  const reportUser = useCallback((userId: string, reason: string) => {
    setState((s) => ({
      ...s,
      users: s.users.map((u) =>
        u.id === s.currentUserId
          ? { ...u, reportedUserIds: [...new Set([...u.reportedUserIds, userId])], blockedUserIds: [...new Set([...u.blockedUserIds, userId])] }
          : u
      ),
    }));
    console.info("TravelMate report (local prototype):", { userId, reason });
  }, []);

  const compatibilityWith = useCallback(
    (userId: string) => {
      if (!currentUser) return null;
      const other = state.users.find((u) => u.id === userId);
      if (!other) return null;
      return compareUsers(currentUser, other);
    },
    [currentUser, state.users]
  );

  const compatibilityWithTrip = useCallback(
    (tripId: string) => {
      if (!currentUser) return null;
      const trip = state.trips.find((t) => t.id === tripId);
      if (!trip) return null;
      const creator = state.users.find((u) => u.id === trip.creatorId);
      return compareUserToTrip(currentUser, trip, creator);
    },
    [currentUser, state.trips, state.users]
  );

  const exploreTrips = useCallback(
    (filters: Partial<ExploreFilters>) => {
      const blocked = new Set(currentUser?.blockedUserIds ?? []);
      return state.trips
        .filter((t) => t.status !== "completed" && t.status !== "cancelled")
        .filter((t) => tripMatchesFilters(t, filters))
        .map((trip) => {
          const group = state.groups.find((g) => g.tripId === trip.id)!;
          const creator = state.users.find((u) => u.id === trip.creatorId);
          const score = currentUser ? compareUserToTrip(currentUser, trip, creator) : null;
          return { trip, group, score };
        })
        .filter((row) => !blocked.has(row.trip.creatorId))
        .sort((a, b) => (b.score?.overall ?? 0) - (a.score?.overall ?? 0));
    },
    [state.trips, state.groups, state.users, currentUser]
  );

  const recommendedTravelers = useCallback(() => {
    if (!currentUser?.compatibilityAnswers) return [];
    const blocked = new Set(currentUser.blockedUserIds);
    return state.users
      .filter((u) => u.id !== currentUser.id && !blocked.has(u.id) && u.compatibilityAnswers)
      .map((user) => ({ user, score: compareUsers(currentUser, user)! }))
      .sort((a, b) => b.score.overall - a.score.overall);
  }, [currentUser, state.users]);

  const value: Store = {
    ...state,
    hydrated,
    currentUser,
    login,
    logout,
    signup,
    verifyCurrentUser,
    completeQuiz,
    updateProfile,
    saveTrip,
    createTrip,
    inviteTraveler,
    respondInvite,
    requestJoin,
    respondJoin,
    removeMember,
    updateTrip,
    sendMessage,
    requestGuide,
    assignGuide,
    addReview,
    blockUser,
    reportUser,
    canReview,
    compatibilityWith,
    compatibilityWithTrip,
    exploreTrips,
    recommendedTravelers,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export function guideCompatibility(me: User | null, guide: Guide) {
  if (!me?.compatibilityAnswers) return null;
  return compareAnswers(me.compatibilityAnswers, guide.answers);
}
