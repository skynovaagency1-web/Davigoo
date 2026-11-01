import * as React from "react";
import { PLACES, estimateRide, formatEuro } from "@/lib/demo-data";

// Station-style board of example trips. Everything on it is fictitious.
const ROUTES: [string, string][] = [
  ["viotte", "tgv"],
  ["centre", "chu"],
  ["battant", "campus"],
  ["citadelle", "viotte"],
  ["planoise", "centre"],
  ["micropolis", "chalezeule"],
  ["campus", "battant"],
  ["tgv", "centre"],
];

const short = (id: string) => PLACES.find((p) => p.id === id)?.short ?? id;
const hhmm = (d: Date) => d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

function useNow() {
  const [now, setNow] = React.useState(() => new Date());
  React.useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

export function DepartureBoard() {
  const now = useNow();
  const [offset, setOffset] = React.useState(0);

  React.useEffect(() => {
    const id = window.setInterval(() => setOffset((o) => (o + 1) % ROUTES.length), 4000);
    return () => window.clearInterval(id);
  }, []);

  const rows = Array.from({ length: 5 }, (_, i) => {
    const [from, to] = ROUTES[(offset + i) % ROUTES.length];
    const e = estimateRide(from, to, "standard")!;
    const pickup = new Date(now.getTime() + (4 + i * 3) * 60000);
    return { key: `${offset + i}`, from, to, e, pickup };
  });

  return (
    <div className="overflow-hidden rounded-md bg-board text-board-foreground shadow-[0_30px_60px_-30px_hsl(var(--board)/0.6)]">
      <div className="flex items-center justify-between border-b border-board-foreground/10 px-5 py-4">
        <div>
          <p className="font-wide text-lg font-black leading-none">Départs</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-board-foreground/50">Besançon · exemples fictifs</p>
        </div>
        <p className="font-mono text-xl font-medium text-signal tnum sm:text-2xl" aria-label="Heure actuelle">
          {now.toLocaleTimeString("fr-FR")}
        </p>
      </div>
      <div className="grid grid-cols-[3.5rem_1fr_auto] gap-x-4 px-5 pb-1 pt-3 font-mono text-[10px] uppercase tracking-wider text-board-foreground/40">
        <span>Prise</span>
        <span>Trajet</span>
        <span className="text-right">Prix</span>
      </div>
      <ul className="divide-y divide-board-foreground/10" aria-live="off">
        {rows.map((r, i) => (
          <li key={r.key} className="grid grid-cols-[3.5rem_1fr_auto] items-center gap-x-4 px-5 py-3.5">
            <span className="flap font-mono text-sm text-signal tnum" style={{ animationDelay: `${i * 60}ms` }}>
              {hhmm(r.pickup)}
            </span>
            <span className="min-w-0">
              <span className="block overflow-hidden text-ellipsis whitespace-nowrap font-semibold">
                <span className="flap" style={{ animationDelay: `${i * 60 + 30}ms` }}>
                  {short(r.from)} <span className="text-board-foreground/40">→</span> {short(r.to)}
                </span>
              </span>
              <span className="block font-mono text-[11px] text-board-foreground/50 tnum">
                {r.e.km.toLocaleString("fr-FR")} km · {r.e.minutes} min
              </span>
            </span>
            <span className="flap text-right font-mono text-sm tnum" style={{ animationDelay: `${i * 60 + 60}ms` }}>
              {formatEuro(r.e.price)}
            </span>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-2 border-t border-board-foreground/10 px-5 py-3 font-mono text-[10px] text-board-foreground/50">
        <span className="size-1.5 animate-pulse rounded-full bg-signal" /> Tarifs d'exemple · catégorie Standard
      </div>
    </div>
  );
}
