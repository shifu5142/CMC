import { api } from "@/lib/api";
import type {
  ReviewRequestPayload,
  ReviewResult,
  ApiResponse,
} from "@/types";

/**
 * Client-side service for running AI code reviews against the mocked
 * `/api/review` endpoint. When the real backend is wired in, swap the route
 * handler — this surface stays unchanged.
 */
export const reviewService = {
  async run(payload: ReviewRequestPayload): Promise<ReviewResult> {
    const res = await api.post<ApiResponse<ReviewResult>>("/api/review", payload);
    if (!res.ok) throw new Error(res.error);
    return res.data;
  },

  async list(): Promise<ReviewResult[]> {
    const res = await api.get<ApiResponse<ReviewResult[]>>("/api/review");
    if (!res.ok) throw new Error(res.error);
    return res.data;
  },
};
