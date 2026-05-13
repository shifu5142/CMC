"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { PlanId, User } from "@/types";

interface UserState {
  user: User | null;
  preferences: {
    notifications: boolean;
    productUpdates: boolean;
    weeklyDigest: boolean;
  };
  setUser: (user: User | null) => void;
  setPlan: (plan: PlanId) => void;
  setPreference: <K extends keyof UserState["preferences"]>(
    key: K,
    value: UserState["preferences"][K],
  ) => void;
  reset: () => void;
}

const initialPreferences: UserState["preferences"] = {
  notifications: true,
  productUpdates: true,
  weeklyDigest: false,
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      preferences: initialPreferences,
      setUser: (user) => set({ user }),
      setPlan: (plan) =>
        set((state) =>
          state.user ? { user: { ...state.user, plan } } : state,
        ),
      setPreference: (key, value) =>
        set((state) => ({
          preferences: { ...state.preferences, [key]: value },
        })),
      reset: () => set({ user: null, preferences: initialPreferences }),
    }),
    {
      name: "codepilot.user",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ preferences: state.preferences }),
    },
  ),
);
