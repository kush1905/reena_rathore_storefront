/**
 * Single source of truth for the storefront API base URL.
 *
 * NEXT_PUBLIC_API_URL should be: https://<host>/api
 * If someone sets only the host origin, we append /api so routes
 * like /homepage resolve to /api/homepage (not a 404 "Route not found").
 */

export const LOCAL_DEV_API_URL = "http://localhost:4000/api";

/** Ensure base is `…/api` with no trailing slash. */
export function normalizeApiBaseUrl(url: string): string {
  const trimmed = url.trim().replace(/\/+$/, "");
  if (!trimmed) return trimmed;
  if (/\/api$/i.test(trimmed)) return trimmed;
  return `${trimmed}/api`;
}

export function getApiBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (fromEnv) {
    return normalizeApiBaseUrl(fromEnv);
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not set. Configure it in Vercel (e.g. https://your-api.onrender.com/api) and redeploy.",
    );
  }

  return LOCAL_DEV_API_URL;
}

export function getApiOrigin(): string {
  return getApiBaseUrl().replace(/\/api\/?$/, "").replace(/\/$/, "");
}

export function apiUrl(path: string): string {
  const base = getApiBaseUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}
