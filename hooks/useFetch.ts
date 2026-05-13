"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api, type ApiError, type ApiRequestOptions } from "@/lib/api";

interface UseFetchResult<T> {
  data: T | null;
  error: ApiError | null;
  loading: boolean;
  /** Re-trigger the request. */
  refetch: () => Promise<void>;
}

interface UseFetchOptions extends ApiRequestOptions {
  /** If false, do not fire the request on mount. */
  enabled?: boolean;
  /** Refetch whenever any of these change. */
  deps?: unknown[];
}

/**
 * Tiny GET-style data fetcher built on top of `lib/api`.
 *
 *   const { data, loading, error, refetch } = useFetch<Result>("/api/review");
 */
export function useFetch<T>(
  path: string | null,
  { enabled = true, deps = [], ...init }: UseFetchOptions = {},
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(enabled && path));
  const aliveRef = useRef(true);

  const run = useCallback(async () => {
    if (!path) return;
    setLoading(true);
    setError(null);
    try {
      const json = await api.get<T>(path, init);
      if (aliveRef.current) setData(json);
    } catch (err) {
      if (aliveRef.current) setError(err as ApiError);
    } finally {
      if (aliveRef.current) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  useEffect(() => {
    aliveRef.current = true;
    if (enabled && path) run();
    return () => {
      aliveRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, enabled, ...deps]);

  return { data, error, loading, refetch: run };
}
