import * as React from "react";
import { Check, Loader2, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/ops/supabase";

type StaffDriver = {
  user_id: string;
  first_name: string;
  email: string;
  vehicle: string;
  plate: string;
  category: string;
  approved: boolean;
  online: boolean;
  created_at: string;
};

type Ride = {
  id: number;
  created_at: string;
  status: string;
  pickup_label: string;
  dropoff_label: string;
  price_estimate: number;
};

const RIDE_STATUS: Record<string, string> = {
  requested: "En attente",
  accepted: "Acceptée",
  arriving: "Chauffeur en route",
  in_progress: "En cours",
  completed: "Terminée",
  cancelled: "Annulée",
};

const fmt = (iso: string) => new Date(iso).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });

// Pilot app: validate drivers (after checking their documents outside the app) and follow rides.
export function AppSection() {
  const [drivers, setDrivers] = React.useState<StaffDriver[]>([]);
  const [rides, setRides] = React.useState<Ride[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [busy, setBusy] = React.useState<string | null>(null);
  const [error, setError] = React.useState("");

  const load = React.useCallback(async () => {
    setLoading(true);
    const [d, r] = await Promise.all([
      supabase.rpc("mova_staff_drivers"),
      supabase.from("mova_rides").select("id,created_at,status,pickup_label,dropoff_label,price_estimate").order("created_at", { ascending: false }).limit(25),
    ]);
    setLoading(false);
    if (d.error || r.error) {
      setError("Impossible de charger les données de l'application. La base est-elle à jour ?");
      return;
    }
    setError("");
    setDrivers((d.data as StaffDriver[]) ?? []);
    setRides((r.data as Ride[]) ?? []);
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const setApproved = async (driver: StaffDriver, approved: boolean) => {
    if (!approved && !window.confirm(`Retirer la validation de ${driver.first_name} ? Il ne pourra plus passer en ligne.`)) return;
    setBusy(driver.user_id);
    const { error } = await supabase
      .from("mova_drivers")
      .update({ approved, ...(approved ? {} : { online: false }), updated_at: new Date().toISOString() })
      .eq("user_id", driver.user_id);
    setBusy(null);
    if (error) setError("La modification n'a pas été enregistrée.");
    load();
  };

  const pending = drivers.filter((d) => !d.approved).length;

  return (
    <section className="glass-card mt-6 rounded-[1.75rem] p-5 sm:p-7" aria-labelledby="app-title">
      <div className="flex items-end justify-between gap-4 border-b pb-3">
        <h2 id="app-title" className="text-lg font-bold">
          Application pilote{" "}
          {pending > 0 && <span className="ml-1 rounded-full bg-signal/20 px-2 py-0.5 text-xs font-semibold">{pending} chauffeur(s) à valider</span>}
        </h2>
        <Button variant="outline" size="sm" onClick={load} aria-label="Actualiser l'application">
          <RefreshCw className={cn("size-4", loading && "animate-spin")} />
        </Button>
      </div>
      {error && <p role="alert" className="mt-4 rounded-2xl border-l-4 border-warning bg-warning/10 p-3 text-sm">{error}</p>}

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Chauffeurs inscrits dans l'app</h3>
          <p className="mt-1 text-xs text-muted-foreground">Validez uniquement après avoir vérifié carte VTC, assurance et véhicule, hors de l'application.</p>
          <ul className="mt-3 divide-y border-y">
            {drivers.map((d) => (
              <li key={d.user_id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <div className="min-w-0">
                  <p className="font-semibold">
                    {d.first_name}{" "}
                    {d.approved ? (
                      <span className="ml-1 text-xs font-normal text-success">{d.online ? "● en ligne" : "validé"}</span>
                    ) : (
                      <span className="ml-1 text-xs font-normal text-warning">à valider</span>
                    )}
                  </p>
                  <p className="truncate text-muted-foreground">{d.email}</p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {d.vehicle} · {d.plate} · {d.category}
                  </p>
                </div>
                {busy === d.user_id ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : d.approved ? (
                  <Button variant="outline" size="sm" onClick={() => setApproved(d, false)}>
                    <X className="size-4" /> Retirer
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => setApproved(d, true)}>
                    <Check className="size-4" /> Valider
                  </Button>
                )}
              </li>
            ))}
            {!loading && !drivers.length && <li className="py-6 text-sm text-muted-foreground">Aucun chauffeur inscrit dans l'application.</li>}
          </ul>
        </div>
        <div>
          <h3 className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Dernières courses</h3>
          <ul className="mt-3 divide-y border-y">
            {rides.map((r) => (
              <li key={r.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 py-3 text-sm">
                <span className="font-mono text-xs text-muted-foreground tnum">{fmt(r.created_at)}</span>
                <span className="min-w-0 truncate">
                  {r.pickup_label} → {r.dropoff_label}
                </span>
                <span className="text-right">
                  <span className="block text-xs font-semibold">{RIDE_STATUS[r.status] ?? r.status}</span>
                  <span className="font-mono text-xs text-muted-foreground tnum">{Number(r.price_estimate).toFixed(2).replace(".", ",")} €</span>
                </span>
              </li>
            ))}
            {!loading && !rides.length && <li className="py-6 text-sm text-muted-foreground">Aucune course pour le moment.</li>}
          </ul>
        </div>
      </div>
    </section>
  );
}
