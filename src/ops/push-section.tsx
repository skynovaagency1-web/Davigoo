import * as React from "react";
import { Loader2, RefreshCw, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { glassInputClass as inputClass } from "@/components/ui/consent";
import { cn } from "@/lib/utils";
import { ops } from "@/ops/client";

type Msg = { id: number; title: string; body: string; url: string; sent: number; created_at: string };

const fmt = (iso: string) => new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

// Notifications to everyone who turned them on (website or installed app).
export function PushSection() {
  const [subs, setSubs] = React.useState<number | null>(null);
  const [messages, setMessages] = React.useState<Msg[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [busy, setBusy] = React.useState(false);
  const [note, setNote] = React.useState("");

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const r = await ops<{ subscribers: number; messages: Msg[] }>("/ops/push");
      setSubs(r.subscribers);
      setMessages(r.messages);
    } catch {
      setNote("Impossible de charger les notifications.");
    }
    setLoading(false);
  }, []);
  React.useEffect(() => {
    load();
  }, [load]);

  const send = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    if (!window.confirm(`Envoyer cette notification à ${subs ?? 0} appareil(s) ?`)) return;
    setBusy(true);
    setNote("");
    try {
      const r = await ops<{ sent: number; removed: number; total: number }>("/ops/push", {
        method: "POST",
        body: { title: f.get("title"), body: f.get("body"), url: f.get("url") || "/" },
      });
      setNote(`Envoyée à ${r.sent} appareil(s) sur ${r.total}.`);
      form.reset();
      load();
    } catch {
      setNote("Envoi impossible. Vérifiez le titre (2 à 60 caractères) et le texte (2 à 180).");
    }
    setBusy(false);
  };

  return (
    <section className="lg-panel mt-6 rounded-[1.75rem] p-5 sm:p-7" aria-labelledby="push-title">
      <div className="flex items-end justify-between gap-4 border-b pb-3">
        <h2 id="push-title" className="text-lg font-bold">
          Notifications <span className="text-sm font-normal text-muted-foreground">· {subs ?? "…"} appareil(s) abonné(s)</span>
        </h2>
        <Button variant="glass" size="sm" onClick={load} aria-label="Actualiser les notifications">
          <RefreshCw className={cn("size-4", loading && "animate-spin")} />
        </Button>
      </div>
      {note && <p role="status" className="mt-4 rounded-2xl border border-white/80 bg-white/60 p-3 text-sm">{note}</p>}
      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <form onSubmit={send} className="grid content-start gap-2">
          <h3 className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Nouvelle notification</h3>
          <input name="title" required minLength={2} maxLength={60} placeholder="Titre (ex. Le pilote ouvre lundi)" aria-label="Titre" className={cn(inputClass, "py-2")} />
          <textarea name="body" required minLength={2} maxLength={180} rows={3} placeholder="Texte court" aria-label="Texte" className={cn(inputClass, "py-2")} />
          <input name="url" maxLength={200} placeholder="Page à ouvrir (ex. /trajets), facultatif" aria-label="Page à ouvrir" className={cn(inputClass, "py-2")} />
          <Button type="submit" variant="glassStrong" size="sm" disabled={busy || !subs}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />} Envoyer
          </Button>
        </form>
        <div>
          <h3 className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Déjà envoyées</h3>
          {messages.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">Aucune notification pour l'instant.</p>
          ) : (
            <ul className="mt-3 divide-y border-y">
              {messages.map((m) => (
                <li key={m.id} className="py-3 text-sm">
                  <p className="font-semibold">{m.title}</p>
                  <p className="text-muted-foreground">{m.body}</p>
                  <p className="text-xs text-muted-foreground">{fmt(m.created_at)} · {m.sent} reçue(s) · {m.url}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
