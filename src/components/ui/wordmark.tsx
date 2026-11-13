import * as React from "react";
import { BRONZE_DARK, BRONZE_LIGHT, LOGO_LINES, LOGO_ORBITS, LOGO_VIEWBOX, LOGO_WHEELS } from "@/lib/logo";
import { cn } from "@/lib/utils";

// The DaviGoo logotype as inline SVG. Lines take the text colour; `tone="light"` uses the pale bronze for dark backgrounds.
// `shine` adds the slow light sweep used on davinova.com.
export function Wordmark({ className, tone = "dark", shine = false, title = "DaviGoo" }: { className?: string; tone?: "dark" | "light"; shine?: boolean; title?: string }) {
  const id = React.useId().replace(/:/g, "");
  const stops = tone === "light" ? BRONZE_LIGHT : BRONZE_DARK;
  return (
    <svg viewBox={LOGO_VIEWBOX} role="img" aria-label={title} className={cn("block h-auto", className)}>
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
          {stops.map((c, i) => <stop key={i} offset={[0, 0.4, 0.75, 1][i]} stopColor={c} />)}
        </linearGradient>
        {shine && (
          <linearGradient id={`${id}s`} gradientUnits="userSpaceOnUse" x1="-120" y1="0" x2="0" y2="0">
            <stop offset="0" stopColor="currentColor" />
            <stop offset=".35" stopColor="currentColor" />
            <stop offset=".5" stopColor="#8e735b" />
            <stop offset=".6" stopColor="#e8d8c4" />
            <stop offset=".75" stopColor="currentColor" />
            <stop offset="1" stopColor="currentColor" />
            <animateTransform attributeName="gradientTransform" type="translate" values="-40 0;440 0;440 0" keyTimes="0;.55;1" dur="4.5s" repeatCount="indefinite" />
          </linearGradient>
        )}
      </defs>
      {LOGO_LINES.map((d) => <path key={d} d={d} fill="none" stroke={shine ? `url(#${id}s)` : "currentColor"} strokeWidth={3.6} />)}
      {LOGO_ORBITS.map((d) => <path key={d} d={d} fill="none" stroke={`url(#${id}g)`} strokeWidth={3.6} strokeLinecap="round" />)}
      {LOGO_WHEELS.map((d) => <path key={d} d={d} fill="none" stroke={`url(#${id}g)`} strokeWidth={2} strokeLinecap="round" />)}
    </svg>
  );
}
