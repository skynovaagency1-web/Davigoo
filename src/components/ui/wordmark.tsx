import * as React from "react";
import { BRONZE_DARK, BRONZE_LIGHT, LOGO_LINES, LOGO_ORBITS, LOGO_VIEWBOX, LOGO_WHEELS } from "@/lib/logo";
import { cn } from "@/lib/utils";

// The DaviGoo logotype as inline SVG. Lines take the text colour; `tone="light"` uses the pale bronze for dark backgrounds.
// `shine` adds the slow light sweep used on davinova.com. Each time the logo scrolls into view (and when the
// welcome film ends) the letters draw themselves and the two wheels roll in.
export function Wordmark({ className, tone = "dark", shine = false, title = "DaviGoo" }: { className?: string; tone?: "dark" | "light"; shine?: boolean; title?: string }) {
  const id = React.useId().replace(/:/g, "");
  const ref = React.useRef<SVGSVGElement>(null);
  const stops = tone === "light" ? BRONZE_LIGHT : BRONZE_DARK;

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let visible = false;
    const play = () => {
      el.classList.remove("wm-play");
      void el.getBoundingClientRect(); // restart the CSS animation
      el.classList.add("wm-play");
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !visible) play();
      visible = e.isIntersecting;
    }, { threshold: 0.6 });
    io.observe(el);
    const replay = () => visible && play();
    window.addEventListener("davigoo:replay", replay);
    return () => { io.disconnect(); window.removeEventListener("davigoo:replay", replay); };
  }, []);

  return (
    <svg ref={ref} viewBox={LOGO_VIEWBOX} role="img" aria-label={title} className={cn("wordmark block h-auto overflow-visible", className)}>
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
      {LOGO_LINES.map((d, i) => (
        <path key={d} className="wm-line" style={{ animationDelay: `${i * 0.1}s` }} d={d} pathLength={100} fill="none" stroke={shine ? `url(#${id}s)` : "currentColor"} strokeWidth={3.6} />
      ))}
      {LOGO_ORBITS.map((d, i) => (
        <g key={d} className="wm-wheel" style={{ animationDelay: `${0.45 + i * 0.12}s` }}>
          <path className="wm-line" style={{ animationDelay: `${0.5 + i * 0.1}s` }} d={d} pathLength={100} fill="none" stroke={`url(#${id}g)`} strokeWidth={3.6} strokeLinecap="round" />
          <path d={LOGO_WHEELS[i]} fill="none" stroke={`url(#${id}g)`} strokeWidth={2} strokeLinecap="round" />
        </g>
      ))}
    </svg>
  );
}
