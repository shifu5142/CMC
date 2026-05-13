"use client";

import { create } from "zustand";
import type { ReviewResult } from "@/types";

interface ReviewState {
  /** Code currently in the editor. */
  code: string;
  language: string;
  filename?: string;
  /** Active review result (or null when idle). */
  current: ReviewResult | null;
  /** Last 25 reviews (in-memory history for the dashboard). */
  history: ReviewResult[];
  /** Async status for the "Run review" button. */
  status: "idle" | "loading" | "success" | "error";
  error?: string;

  setCode: (code: string) => void;
  setLanguage: (language: string) => void;
  setFilename: (filename?: string) => void;
  setStatus: (status: ReviewState["status"], error?: string) => void;
  setCurrent: (review: ReviewResult | null) => void;
  pushHistory: (review: ReviewResult) => void;
  reset: () => void;
}

const initialCode = `// Paste or upload code, then click "Run Review".
export async function getUser(email: string) {
  const sql = \`SELECT * FROM users WHERE email = '\${email}'\`;
  return db.query(sql);
}
`;

export const useReviewStore = create<ReviewState>((set) => ({
  code: initialCode,
  language: "typescript",
  filename: "users.ts",
  current: null,
  history: [],
  status: "idle",
  error: undefined,

  setCode: (code) => set({ code }),
  setLanguage: (language) => set({ language }),
  setFilename: (filename) => set({ filename }),
  setStatus: (status, error) => set({ status, error }),
  setCurrent: (review) => set({ current: review }),
  pushHistory: (review) =>
    set((state) => ({
      history: [review, ...state.history.filter((r) => r.id !== review.id)].slice(
        0,
        25,
      ),
    })),
  reset: () =>
    set({
      code: initialCode,
      current: null,
      status: "idle",
      error: undefined,
    }),
}));
