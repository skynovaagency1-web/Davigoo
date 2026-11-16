// The site is installable as an app (PWA) through the browser's own menu; there is no install button on the page.
// This registers the service worker (offline loading, notifications) and, inside the installed app only,
// offers notifications once (hidden for 30 days after « Plus tard »).
import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, X } from "lucide-react";
import { enablePush, pushSupported } from "@/lib/push";

const PUSH_SNOOZE_KEY = "davigoo-push-snooze";
const SNOOZE_DAYS = 30;

const isStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;

function snoozed() {
  try {
    return Date.now() - Number(localStorage.getItem(PUSH_SNOOZE_KEY) || 0) < SNOOZE_DAYS * 864e5;
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
  const [ask, setAsk] = React.useState(false);

  React.useEffect(() => {
    registerServiceWorker();
    if (!isStandalone() || !pushSupported() || Notification.permission !== "default" || snoozed()) return;
    const t = window.setTimeout(() => setAsk(true), 3000);
    return () => window.clearTimeout(t);
  }, []);

  const later = () => {
    try {
      localStorage.setItem(PUSH_SNOOZE_KEY, String(Date.now()));
    } catch {
      /* private mode: just hide for now */
    }
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

  return (
    <AnimatePresence>
      {ask && (
        <motion.div
          role="dialog"
          aria-label="Activer les notifications"
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
                <p className="font-semibold text-[#f6efe7]">Activer les notifications</p>
                <p className="text-xs text-[#c9bcae]">Soyez prévenu de l'ouverture du pilote et des nouveautés. Pas de publicité.</p>
              </div>
              <button type="button" onClick={later} aria-label="Fermer" className="grid size-8 shrink-0 place-items-center rounded-full text-[#c9bcae] hover:bg-white/10">
                <X className="size-4" />
              </button>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={notify} className="lg lg-strong inline-flex h-11 flex-1 items-center justify-center gap-2 text-sm">
                <Bell className="size-4" /> Activer
              </button>
              <button type="button" onClick={later} className="h-11 rounded-[12px] px-4 text-sm text-[#c9bcae] hover:bg-white/10">
                Plus tard
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
