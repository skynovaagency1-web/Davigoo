import * as React from "react";

// Welcome film shown over the page on every load and refresh: the saloon drives in, shatters and reforms
// as the DaviGoo logo. It runs in /intro.html; a click or "Passer" skips it. Skipped for reduced motion.
export function IntroOverlay() {
  const [state, setState] = React.useState<"on" | "leaving" | "off">(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "off" : "on",
  );

  const close = React.useCallback(() => setState((s) => (s === "on" ? "leaving" : s)), []);

  React.useEffect(() => {
    if (state === "on") {
      document.documentElement.style.overflow = "hidden";
      const onMsg = (e: MessageEvent) => e.data === "davigoo-intro-done" && close();
      window.addEventListener("message", onMsg);
      const t = window.setTimeout(close, 12000);
      return () => { window.removeEventListener("message", onMsg); window.clearTimeout(t); };
    }
    if (state === "leaving") {
      const t = window.setTimeout(() => {
        setState("off");
        document.documentElement.style.overflow = "";
        window.dispatchEvent(new Event("davigoo:replay"));
      }, 500);
      return () => window.clearTimeout(t);
    }
  }, [state, close]);

  if (state === "off") return null;
  return (
    <div
      className="fixed inset-0 z-[200] bg-gradient-to-b from-[#f3eee8] to-[#d8cec2] transition-opacity duration-500"
      style={{ opacity: state === "leaving" ? 0 : 1 }}
      aria-label="Bienvenue chez DaviGoo"
      role="dialog"
    >
      <iframe src={`${import.meta.env.BASE_URL}intro.html`} title="DaviGoo" className="h-full w-full border-0" />
      <button
        type="button"
        onClick={close}
        className="glass absolute rounded-full px-4 py-1.5 text-sm font-medium text-foreground"
        style={{ right: "max(16px, env(safe-area-inset-right))", bottom: "max(16px, env(safe-area-inset-bottom))" }}
      >
        Passer
      </button>
    </div>
  );
}
