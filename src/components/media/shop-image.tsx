"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { BLUR, sizedImage } from "@/lib/image";
import { resolveMediaUrl } from "@/lib/media";

function isUploadedAsset(url: string) {
  return /\/uploads\//.test(url) || url.startsWith("blob:") || url.startsWith("data:");
}

export function ShopImage({
  src,
  alt,
  width = 1200,
  className,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  fill = false,
}: {
  src: string;
  alt: string;
  width?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const resolved = resolveMediaUrl(src);
  const url = sizedImage(resolved, width);
  if (!url || failed) return <div className={cn("bg-muted", fill && "absolute inset-0", className)} />;

  const onError = () => setFailed(true);

  // Local/API uploads bypass next/image remotePatterns so any API host works in demo/prod.
  if (isUploadedAsset(url)) {
    if (fill) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={alt} className={cn("absolute inset-0 h-full w-full object-cover", className)} onError={onError} />
      );
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={alt}
        width={width}
        height={Math.round(width * 1.25)}
        className={cn("h-full w-full object-cover", className)}
        onError={onError}
      />
    );
  }

  if (fill) {
    return (
      <Image
        src={url}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        blurDataURL={BLUR}
        className={cn("object-cover", className)}
        onError={onError}
        unoptimized
      />
    );
  }

  return (
    <Image
      src={url}
      alt={alt}
      width={width}
      height={Math.round(width * 1.25)}
      sizes={sizes}
      priority={priority}
      placeholder="blur"
      blurDataURL={BLUR}
      className={cn("h-full w-full object-cover", className)}
      onError={onError}
      unoptimized
    />
  );
}
