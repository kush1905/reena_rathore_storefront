import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

if (process.env.VERCEL && !configuredApiUrl) {
  throw new Error(
    "NEXT_PUBLIC_API_URL must be set for Vercel builds (e.g. https://your-api.onrender.com/api).",
  );
}

/** Prefer …/api; if only the host is set, append /api. */
function normalizeApiBaseUrl(url: string): string {
  const trimmed = url.trim().replace(/\/+$/, "");
  if (/\/api$/i.test(trimmed)) return trimmed;
  return `${trimmed}/api`;
}

const resolvedApiUrl = configuredApiUrl
  ? normalizeApiBaseUrl(configuredApiUrl)
  : process.env.NODE_ENV === "production"
    ? ""
    : "http://localhost:4000/api";

const apiHost = (() => {
  try {
    if (!resolvedApiUrl) return null;
    return new URL(resolvedApiUrl.replace(/\/api\/?$/, "")).hostname;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: resolvedApiUrl,
  },
  devIndicators: false,
  outputFileTracingRoot: path.join(fileURLToPath(new URL(".", import.meta.url))),
  turbopack: { root: path.join(fileURLToPath(new URL(".", import.meta.url))) },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "videos.pexels.com" },
      { protocol: "https", hostname: "assets.mixkit.co" },
      { protocol: "http", hostname: "localhost", pathname: "/uploads/**" },
      { protocol: "http", hostname: "127.0.0.1", pathname: "/uploads/**" },
      ...(apiHost
        ? ([
            { protocol: "https", hostname: apiHost, pathname: "/uploads/**" },
            { protocol: "http", hostname: apiHost, pathname: "/uploads/**" },
          ] as const)
        : []),
    ],
  },
};

export default nextConfig;
