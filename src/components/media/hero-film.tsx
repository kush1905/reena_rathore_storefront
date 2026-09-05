"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { ShopImage } from "@/components/media/shop-image";

export function HeroFilm({
  src,
  poster,
  className,
}: {
  src: string;
  poster: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reduce, setReduce] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;
    const tryPlay = () => {
      void node.play().catch(() => setFailed(true));
    };
    tryPlay();
  }, [src]);

  function toggle() {
    const node = videoRef.current;
    if (!node) return;
    if (node.paused) void node.play();
    else node.pause();
  }

  if (reduce || failed || !src) {
    return <ShopImage src={poster} alt="" fill priority width={1920} sizes="100vw" className={className} />;
  }

  return (
    <>
      <video
        ref={videoRef}
        className={cn(
          "hero-film absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
          ready ? "opacity-100" : "opacity-0",
          className,
        )}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={poster}
        aria-hidden
        onError={() => setFailed(true)}
        onLoadedData={() => setReady(true)}
        onPlaying={() => {
          setReady(true);
          setPlaying(true);
        }}
        onPause={() => setPlaying(false)}
      >
        <source src={src} type="video/mp4" />
      </video>
      <button
        type="button"
        onClick={toggle}
        className="absolute right-5 bottom-5 z-[3] flex size-9 items-center justify-center border border-white/20 bg-black/15 text-white/80 backdrop-blur-sm transition-colors hover:border-accent/50 hover:bg-black/35 hover:text-accent sm:right-6 sm:bottom-6"
        aria-label={playing ? "Pause film" : "Play film"}
      >
        {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5 translate-x-px" />}
      </button>
    </>
  );
}
