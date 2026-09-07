import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const apiHost = (() => {
  try {
    const url = process.env.NEXT_PUBLIC_API_URL;
    if (!url) return null;
    return new URL(url.replace(/\/api\/?$/, "")).hostname;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
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
