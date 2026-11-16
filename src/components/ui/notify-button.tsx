// "Être prévenu" button: turns on notifications in this browser (see src/lib/push.ts).
import * as React from "react";
import { Bell, BellRing } from "lucide-react";
import { enablePush, pushSupported } from "@/lib/push";

const IOS_NOT_INSTALLED = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.matchMedia("(display-mode: standalone)").matches;

export function NotifyButton({ className = "" }: { className?: string }) {
  const [state, setState] = React.useState<"idle" | "busy" | "on" | "denied" | "ios" | "hidden">("idle");

  React.useEffect(() => {
    if (IOS_NOT_INSTALLED()) setState("ios");
    else if (!pushSupported()) setState("hidden");
    else if (Notification.permission === "granted") setState("on");
  }, []);

  if (state === "hidden") return null;
  if (state === "ios")
    return <p className={`text-sm text-muted-foreground ${className}`}>Sur iPhone, ajoutez DaviGoo à l'écran d'accueil (Partager, puis « Sur l'écran d'accueil ») pour recevoir les notifications.</p>;
  if (state === "on")
    return <p className={`flex items-center justify-center gap-2 text-sm font-medium ${className}`}><BellRing className="size-4" /> Notifications activées</p>;

  const go = async () => {
    setState("busy");
    try {
      const r = await enablePush();
      setState(r === "on" ? "on" : r === "denied" ? "denied" : "hidden");
    } catch {
      setState("idle");
    }
  };
  return (
    <div className={`grid gap-1 ${className}`}>
      <button type="button" onClick={go} disabled={state === "busy"} className="lg lg-strong inline-flex h-11 items-center justify-center gap-2 px-5 text-sm">
        <Bell className="size-4" /> {state === "busy" ? "Activation…" : "Être prévenu par notification"}
      </button>
      {state === "denied" && <p className="text-xs text-muted-foreground">Notifications refusées. Vous pouvez les autoriser dans les réglages du navigateur.</p>}
    </div>
  );
}
