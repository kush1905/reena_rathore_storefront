"use client";

import type { ReactNode } from "react";

export type AtelierTone = "linen" | "petal" | "vine" | "jaali" | "sand" | "lotus";
export type CornerStyle = AtelierTone | "crest";

export function AtelierPanel({
  children,
  tone = "linen",
  corner,
  className = "",
  contentClassName = "",
  corners = true,
}: {
  children: ReactNode;
  tone?: AtelierTone;
  /** Override corner ornament; defaults to the section tone */
  corner?: CornerStyle;
  className?: string;
  contentClassName?: string;
  corners?: boolean;
}) {
  const ornament = corner ?? tone;

  return (
    <section className={`atelier-panel atelier-panel--${tone} relative overflow-hidden ${className}`}>
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="atelier-panel__wash absolute inset-0" />
        <div className="atelier-panel__motif absolute inset-0" />
        <div className="atelier-panel__grain absolute inset-0" />
        <div className="atelier-panel__bloom atelier-panel__bloom--a absolute" />
        <div className="atelier-panel__bloom atelier-panel__bloom--b absolute" />
        {corners ? (
          <>
            <CornerOrnament style={ornament} className="atelier-corner atelier-corner--tl" />
            <CornerOrnament style={ornament} className="atelier-corner atelier-corner--tr" mirrorX />
            <CornerOrnament style={ornament} className="atelier-corner atelier-corner--bl" mirrorY />
            <CornerOrnament style={ornament} className="atelier-corner atelier-corner--br" mirrorX mirrorY />
          </>
        ) : null}
      </div>
      <div className={`relative z-[1] ${contentClassName}`}>{children}</div>
    </section>
  );
}

function CornerOrnament({
  style,
  className,
  mirrorX,
  mirrorY,
}: {
  style: CornerStyle;
  className: string;
  mirrorX?: boolean;
  mirrorY?: boolean;
}) {
  const transform = [mirrorX ? "scaleX(-1)" : "", mirrorY ? "scaleY(-1)" : ""].filter(Boolean).join(" ");
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" style={transform ? { transform } : undefined}>
      {style === "linen" ? <LinenCorner /> : null}
      {style === "petal" ? <PetalCorner /> : null}
      {style === "vine" ? <VineCorner /> : null}
      {style === "jaali" ? <JaaliCorner /> : null}
      {style === "sand" ? <PaisleyCorner /> : null}
      {style === "lotus" ? <LotusCorner /> : null}
      {style === "crest" ? <CrestCorner /> : null}
    </svg>
  );
}

function LinenCorner() {
  return (
    <>
      <path d="M8 82V26c0-10 8-18 18-18h56" stroke="currentColor" strokeWidth="1.25" />
      <path d="M26 26h18M26 26v18" stroke="currentColor" strokeWidth="1" opacity="0.55" />
      <path
        d="M34 18c5 6 8 11 8 16s-3 10-8 16c-5-6-8-11-8-16s3-10 8-16z"
        stroke="currentColor"
        strokeWidth="1.05"
      />
      <circle cx="34" cy="34" r="3" fill="currentColor" opacity="0.5" />
      <path d="M58 14h24M14 58v24" stroke="currentColor" strokeWidth="1" opacity="0.45" />
      <path d="M70 20c5 2 9 6 10 11M86 18c-4 5-5 10-4 15" stroke="currentColor" strokeWidth="0.95" opacity="0.6" />
    </>
  );
}

function PetalCorner() {
  return (
    <>
      <path d="M12 78V32c0-11 9-20 20-20h46" stroke="currentColor" strokeWidth="1.15" opacity="0.7" />
      <g transform="translate(32 32)">
        <path d="M0-16c4.5 4.5 7 9 7 12.5S4.5 3 0 6.5C-4.5 3-7-1.5-7-4.5S-4.5-11.5 0-16z" stroke="currentColor" strokeWidth="1.1" />
        <path d="M0-16c4.5 4.5 7 9 7 12.5S4.5 3 0 6.5C-4.5 3-7-1.5-7-4.5S-4.5-11.5 0-16z" stroke="currentColor" strokeWidth="1.1" transform="rotate(72)" />
        <path d="M0-16c4.5 4.5 7 9 7 12.5S4.5 3 0 6.5C-4.5 3-7-1.5-7-4.5S-4.5-11.5 0-16z" stroke="currentColor" strokeWidth="1.1" transform="rotate(144)" />
        <path d="M0-16c4.5 4.5 7 9 7 12.5S4.5 3 0 6.5C-4.5 3-7-1.5-7-4.5S-4.5-11.5 0-16z" stroke="currentColor" strokeWidth="1.1" transform="rotate(216)" />
        <path d="M0-16c4.5 4.5 7 9 7 12.5S4.5 3 0 6.5C-4.5 3-7-1.5-7-4.5S-4.5-11.5 0-16z" stroke="currentColor" strokeWidth="1.1" transform="rotate(288)" />
        <circle r="3.2" fill="currentColor" opacity="0.55" />
      </g>
      <path d="M62 16h20M16 62v20" stroke="currentColor" strokeWidth="0.95" opacity="0.4" />
    </>
  );
}

function VineCorner() {
  return (
    <>
      <path d="M14 96C18 70 28 52 48 40c14-8 28-10 42-6" stroke="currentColor" strokeWidth="1.2" />
      <path d="M48 40c-2-14 4-26 16-34" stroke="currentColor" strokeWidth="1.05" opacity="0.85" />
      <path
        d="M42 52c-8-2-14 2-18 8 8 2 14 0 18-8zM62 34c-2-8 2-14 8-18 2 8 0 14-8 18zM78 38c6-4 14-4 20 0-4 6-12 8-20 0z"
        stroke="currentColor"
        strokeWidth="1"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <circle cx="48" cy="40" r="2.4" fill="currentColor" opacity="0.55" />
      <path d="M20 72c8-2 12-8 14-14" stroke="currentColor" strokeWidth="0.95" opacity="0.55" />
    </>
  );
}

function JaaliCorner() {
  return (
    <>
      <path d="M10 76V24c0-8 6-14 14-14h52" stroke="currentColor" strokeWidth="1.15" />
      <path d="M36 16l8 14h16l-12 10 4 16-16-8-16 8 4-16-12-10h16z" stroke="currentColor" strokeWidth="1.05" />
      <circle cx="36" cy="40" r="4.5" stroke="currentColor" strokeWidth="1" />
      <circle cx="36" cy="40" r="1.8" fill="currentColor" opacity="0.5" />
      <path d="M64 18h18M18 64v18" stroke="currentColor" strokeWidth="1" opacity="0.45" />
      <path d="M72 28l8 8M80 28l-8 8" stroke="currentColor" strokeWidth="0.95" opacity="0.55" />
    </>
  );
}

function PaisleyCorner() {
  return (
    <>
      <path d="M12 80V28c0-10 8-18 18-18h50" stroke="currentColor" strokeWidth="1.1" opacity="0.65" />
      <path
        d="M34 18c12 2 22 14 22 28 0 14-10 22-22 22-4 0-8-1-10-3 10-4 16-12 16-22S40 24 34 18z"
        stroke="currentColor"
        strokeWidth="1.15"
      />
      <path d="M38 28c6 3 10 9 10 15s-3 11-8 14" stroke="currentColor" strokeWidth="0.95" opacity="0.7" />
      <circle cx="42" cy="40" r="2.6" fill="currentColor" opacity="0.5" />
      <path d="M62 16c6 4 10 10 11 16M78 20c-4 6-5 12-3 18" stroke="currentColor" strokeWidth="0.95" opacity="0.55" />
      <path d="M16 58v22" stroke="currentColor" strokeWidth="1" opacity="0.4" />
    </>
  );
}

function LotusCorner() {
  return (
    <>
      <path d="M10 78V30c0-10 8-18 18-18h52" stroke="currentColor" strokeWidth="1.1" opacity="0.55" />
      <path
        d="M36 54c0-10 6-18 14-22-4 8-4 16 0 24-8-2-14-8-14-2z"
        stroke="currentColor"
        strokeWidth="1.05"
      />
      <path
        d="M50 30c2 8 2 16 0 24 8-4 14-12 14-22-8 4-12 10-14-2z"
        stroke="currentColor"
        strokeWidth="1.05"
      />
      <path d="M43 28c4 6 6 12 6 18s-2 12-6 18c-4-6-6-12-6-18s2-12 6-18z" stroke="currentColor" strokeWidth="1.15" />
      <circle cx="43" cy="46" r="2.5" fill="currentColor" opacity="0.5" />
      <path d="M66 16h18M16 66v18" stroke="currentColor" strokeWidth="0.95" opacity="0.4" />
      <path d="M70 24c5 1 9 4 11 8" stroke="currentColor" strokeWidth="0.9" opacity="0.55" />
    </>
  );
}

function CrestCorner() {
  return (
    <>
      <path d="M8 84V28c0-10 8-18 18-18h56" stroke="currentColor" strokeWidth="1.2" />
      <path d="M26 22h20v20H26z" stroke="currentColor" strokeWidth="1" opacity="0.55" />
      <path d="M30 32h12M36 26v12" stroke="currentColor" strokeWidth="1" />
      <path d="M54 16c8 4 14 12 14 22S62 56 54 60c-8-4-14-12-14-22s6-18 14-22z" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="54" cy="38" r="3" fill="currentColor" opacity="0.45" />
      <path d="M74 20h18M14 74v18" stroke="currentColor" strokeWidth="1" opacity="0.45" />
      <path d="M78 28c6 0 12 4 14 10M96 26c-4 6-4 12-2 18" stroke="currentColor" strokeWidth="0.95" opacity="0.55" />
    </>
  );
}
