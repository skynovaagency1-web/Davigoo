// "Installer DaviGoo": makes the site installable as an app (PWA).
// Android / Chrome / Edge: the browser's own install prompt. iPhone / iPad (Safari): there is no prompt,
// so the button opens the two steps (Partager, puis « Sur l'écran d'accueil »).
// Hidden once the app is installed, and for 30 days after « Plus tard ».
import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Share, SquarePlus, X } from "lucide-react";
import { enablePush, pushSupported } from "@/lib/push";

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

const SNOOZE_KEY = "davigoo-install-snooze";
const SNOOZE_DAYS = 30;
const PUSH_SNOOZE_KEY = "davigoo-push-snooze";

const isStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
const isIos = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

function snoozed(key = SNOOZE_KEY) {
  try {
    const t = Number(localStorage.getItem(key) || 0);
    return Date.now() - t < SNOOZE_DAYS * 864e5;
  } catch {
    return false;
  }
}

/** Registers the service worker (offline loading, notifications). Safe to call more than once. */
export function registerServiceWorker() {
  if (!("serviceWorker" in navigator) || import.meta.env.DEV) return;
  window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}), { once: true });
}

export function InstallPrompt() {
  const [deferred, setDeferred] = React.useState<InstallEvent | null>(null);
  const [ios, setIos] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const [steps, setSteps] = React.useState(false);
  const [ask, setAsk] = React.useState(false); // installed app: offer notifications once

  React.useEffect(() => {
    registerServiceWorker();
    if (isStandalone()) {
      if (pushSupported() && Notification.permission === "default" && !snoozed(PUSH_SNOOZE_KEY)) {
        const t = window.setTimeout(() => setAsk(true), 3000);
        return () => window.clearTimeout(t);
      }
      return;
    }
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as InstallEvent);
      if (!snoozed()) setShow(true);
    };
    const onInstalled = () => setShow(false);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    let t: number | undefined;
    if (isIos() && !snoozed()) {
      setIos(true);
      t = window.setTimeout(() => setShow(true), 2500); // let the page settle first
    }
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      window.clearTimeout(t);
    };
  }, []);

  const later = () => {
    try {
      localStorage.setItem(ask ? PUSH_SNOOZE_KEY : SNOOZE_KEY, String(Date.now()));
    } catch {
      /* private mode: just hide for now */
    }
    setShow(false);
    setSteps(false);
    setAsk(false);
  };

  const notify = async () => {
    try {
      await enablePush();
    } catch {
      /* try again next time */
    }
    setAsk(false);
  };

  const install = async () => {
    if (deferred) {
      await deferred.prompt();
      const { outcome } = await deferred.userChoice;
      setDeferred(null);
      if (outcome === "accepted") setShow(false);
      return;
    }
    if (ios) setSteps(true);
  };

  return (
    <AnimatePresence>
      {(ask || (show && (deferred || ios))) && (
        <motion.div
          role="dialog"
          aria-label={ask ? "Activer les notifications" : "Installer l'application DaviGoo"}
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, transition: { duration: 0.15 } }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
          className="fixed inset-x-3 bottom-[max(12px,env(safe-area-inset-bottom))] z-[60] mx-auto max-w-md"
        >
          <div className="menu-panel flex flex-col gap-3 p-4">
            <div className="flex items-center gap-3">
              <img src="/icons/icon-192.png" alt="" className="size-12 shrink-0 rounded-[12px]" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-[#f6efe7]">{ask ? "Activer les notifications" : "Installer DaviGoo"}</p>
                <p className="text-xs text-[#c9bcae]">
                  {ask ? "Soyez prévenu de l'ouverture du pilote et des nouveautés. Pas de publicité." : "L'app sur votre écran d'accueil : plein écran, rapide, même hors connexion."}
                </p>
              </div>
              <button type="button" onClick={later} aria-label="Fermer" className="grid size-8 shrink-0 place-items-center rounded-full text-[#c9bcae] hover:bg-white/10">
                <X className="size-4" />
              </button>
            </div>
            {steps && !ask ? (
              <ol className="grid gap-2 rounded-[14px] bg-white/[0.08] p-3 text-sm text-[#f6efe7]">
                <li className="flex items-center gap-2">
                  <span className="font-mono text-xs text-[#c9bcae]">1</span> Touchez <Share className="size-4" aria-label="Partager" /> <b>Partager</b> en bas de Safari
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-mono text-xs text-[#c9bcae]">2</span> Choisissez <SquarePlus className="size-4" aria-hidden /> <b>Sur l'écran d'accueil</b>
                </li>
              </ol>
            ) : (
              <div className="flex gap-2">
                <button type="button" onClick={ask ? notify : install} className="lg lg-strong inline-flex h-11 flex-1 items-center justify-center gap-2 text-sm">
                  {ask && <Bell className="size-4" />} {ask ? "Activer" : "Installer"}
                </button>
                <button type="button" onClick={later} className="h-11 rounded-[12px] px-4 text-sm text-[#c9bcae] hover:bg-white/10">
                  Plus tard
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
