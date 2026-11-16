// Turns on DaviGoo notifications in this browser (news, opening of the pilot).
// On iPhone this only works once the site is added to the home screen (iOS 16.4+).
import { api } from "@/lib/api";

export const pushSupported = () =>
  typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;

const keyBytes = (b64: string) => {
  const s = atob(b64.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((b64.length + 3) % 4));
  return Uint8Array.from(s, (c) => c.charCodeAt(0));
};

/** Asks permission and subscribes. Returns "on", "denied" or "unsupported". */
export async function enablePush(): Promise<"on" | "denied" | "unsupported"> {
  if (!pushSupported()) return "unsupported";
  const perm = await Notification.requestPermission();
  if (perm !== "granted") return "denied";
  const reg = await navigator.serviceWorker.ready;
  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    const { key } = await api<{ key: string }>("/push/key");
    sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyBytes(key) });
  }
  await api("/push/subscribe", { method: "POST", body: { endpoint: sub.endpoint } });
  return "on";
}
