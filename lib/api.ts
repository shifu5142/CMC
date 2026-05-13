/**
 * Tiny typed fetch wrapper used by every service.
 * Adds JSON parsing, error normalization and an optional `next` cache option.
 */

import { absoluteUrl } from "./utils";

export type ApiError = {
  message: string;
  status: number;
  details?: unknown;
};

export type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  /** Next.js `next` revalidate hint. */
  next?: { revalidate?: number; tags?: string[] };
};

async function request<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { body, headers, next, ...rest } = options;
  const url = path.startsWith("http") ? path : absoluteUrl(path);

  const init: RequestInit & { next?: ApiRequestOptions["next"] } = {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  };
  if (next) (init as { next?: ApiRequestOptions["next"] }).next = next;

  const res = await fetch(url, init);
  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const err: ApiError = {
      message:
        (isJson && (payload as { error?: string }).error) ||
        `Request failed with status ${res.status}`,
      status: res.status,
      details: payload,
    };
    throw err;
  }

  return payload as T;
}

export const api = {
  get: <T>(path: string, options?: ApiRequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    request<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    request<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: ApiRequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
