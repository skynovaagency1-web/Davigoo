// Adapted from 21st.dev "Ride Booking Form" by ravikatiyar162.
// Changes: French copy, Besançon demo places as selects, date/time inputs, vehicle category,
// fictitious estimate panel, and an illustrated route instead of a remote photo.
import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, Info, MapPin, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORIES, PLACES, estimateRide, formatEuro, type Category, type Estimate } from "@/lib/demo-data";

interface RideBookingFormProps extends React.HTMLAttributes<HTMLDivElement> {
  city?: string;
}

const fieldClass =
  "w-full bg-transparent py-2 pl-4 pr-2 text-foreground focus:outline-none [&>option]:bg-card";

export const RideBookingForm = React.forwardRef<HTMLDivElement, RideBookingFormProps>(
  ({ className, city = "Besançon, FR", ...props }, ref) => {
    const today = new Date().toISOString().slice(0, 10);
    const [pickup, setPickup] = React.useState("viotte");
    const [dropoff, setDropoff] = React.useState("centre");
    const [date, setDate] = React.useState(today);
    const [time, setTime] = React.useState("");
    const [category, setCategory] = React.useState<Category["id"]>("standard");
    const [estimate, setEstimate] = React.useState<Estimate | null>(null);
    const [error, setError] = React.useState("");

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const result = estimateRide(pickup, dropoff, category, time || undefined);
      if (!result) {
        setEstimate(null);
        setError("Choisissez un départ et une destination différents.");
        return;
      }
      setError("");
      setEstimate(result);
    };

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
    };
    const itemVariants = {
      hidden: { y: 20, opacity: 0 },
      visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
    };

    return (
      <div className={cn("w-full", className)} ref={ref} {...props}>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <motion.div variants={itemVariants} className="mb-5">
              <span className="text-sm text-muted-foreground">
                <MapPin className="mr-2 inline-block h-4 w-4 text-primary" />
                {city} · zone pilote à définir
              </span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Vos trajets VTC à Besançon, <span className="text-primary">simplement.</span>
            </motion.h1>
            <motion.p variants={itemVariants} className="mb-8 max-w-xl text-lg text-muted-foreground">
              MOVA est un projet de plateforme locale qui met en relation passagers et chauffeurs VTC indépendants.
              Testez le parcours ci-dessous : l'estimation est fictive.
            </motion.p>

            <form id="devis" onSubmit={handleSubmit} className="scroll-mt-28 space-y-4" aria-describedby="devis-note">
              <motion.div variants={itemVariants} className="relative rounded-lg bg-muted/50 p-4">
                <div className="absolute bottom-9 left-[1.6rem] top-9 w-px border-l border-dashed border-border" />
                <div className="relative flex items-center">
                  <div className="z-10 rounded-full border bg-background p-1">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <label className="sr-only" htmlFor="pickup">Départ</label>
                  <select id="pickup" value={pickup} onChange={(e) => setPickup(e.target.value)} className={fieldClass}>
                    {PLACES.map((p) => (
                      <option key={p.id} value={p.id}>{p.label}</option>
                    ))}
                  </select>
                </div>
                <hr className="mx-12 my-2 border-border" />
                <div className="relative flex items-center">
                  <div className="z-10 rounded-full border bg-background p-1">
                    <Plus className="h-4 w-4" />
                  </div>
                  <label className="sr-only" htmlFor="dropoff">Destination</label>
                  <select id="dropoff" value={dropoff} onChange={(e) => setDropoff(e.target.value)} className={fieldClass}>
                    {PLACES.map((p) => (
                      <option key={p.id} value={p.id}>{p.label}</option>
                    ))}
                  </select>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                <label className="flex items-center rounded-lg bg-muted/50 px-4 py-2.5">
                  <Calendar className="h-5 w-5 shrink-0 text-muted-foreground" />
                  <span className="sr-only">Date</span>
                  <input type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} className="ml-3 w-full bg-transparent text-foreground focus:outline-none [color-scheme:dark]" />
                </label>
                <label className="flex items-center rounded-lg bg-muted/50 px-4 py-2.5">
                  <Clock className="h-5 w-5 shrink-0 text-muted-foreground" />
                  <span className="sr-only">Heure (vide = maintenant)</span>
                  <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="ml-3 w-full bg-transparent text-foreground focus:outline-none [color-scheme:dark]" />
                </label>
              </motion.div>

              <motion.fieldset variants={itemVariants} className="grid grid-cols-3 gap-2">
                <legend className="sr-only">Catégorie de véhicule</legend>
                {CATEGORIES.map((c) => (
                  <label
                    key={c.id}
                    className={cn(
                      "cursor-pointer rounded-lg border px-2 py-2.5 text-center text-sm font-semibold transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
                      category === c.id ? "border-primary bg-primary/10 text-foreground" : "text-muted-foreground hover:border-muted-foreground",
                    )}
                  >
                    <input type="radio" name="category" value={c.id} checked={category === c.id} onChange={() => setCategory(c.id)} className="sr-only" />
                    {c.label}
                    <span className="block text-xs font-normal">{c.hint}</span>
                  </label>
                ))}
              </motion.fieldset>

              <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="submit"
                  className="inline-flex h-12 items-center justify-center whitespace-nowrap rounded-md bg-primary px-8 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Voir l'estimation
                </button>
                <a href="./app.html" className="group text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Essayer le prototype d'app
                  <ArrowRight className="ml-1 inline-block h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </motion.div>

              <div aria-live="polite">
                {error && <p className="text-sm font-medium text-warning">{error}</p>}
                {estimate && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg border border-dashed bg-card p-4"
                  >
                    <div className="flex flex-wrap items-end justify-between gap-2">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estimation fictive</p>
                        <p className="text-3xl font-extrabold text-primary">≈ {formatEuro(estimate.price)}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        ~{estimate.km.toLocaleString("fr-FR")} km · ~{estimate.minutes} min
                        {estimate.night && " · tarif soirée"}
                      </p>
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">
                      Aucune réservation n'est créée. Le tarif réel, la commission et les frais d'annulation restent à définir et à valider.
                    </p>
                  </motion.div>
                )}
              </div>
              <p id="devis-note" className="flex items-start gap-2 text-xs text-muted-foreground">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                Prix calculés à vol d'oiseau avec un barème d'exemple, sans itinéraire réel.
              </p>
            </form>
          </motion.div>

          <motion.div
            className="hidden h-full lg:block"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <RouteIllustration from={PLACES.find((p) => p.id === pickup)?.short} to={PLACES.find((p) => p.id === dropoff)?.short} />
          </motion.div>
        </div>
      </div>
    );
  },
);
RideBookingForm.displayName = "RideBookingForm";

function RouteIllustration({ from, to }: { from?: string; to?: string }) {
  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border bg-card">
      <svg viewBox="0 0 400 500" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="hsl(var(--border))" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="400" height="500" fill="url(#grid)" opacity="0.5" />
        {/* The Doubs loop around the old town */}
        <path d="M-20 300 C 80 240, 120 120, 220 140 S 360 300, 260 360 S 120 380, 160 520" fill="none" stroke="hsl(210 70% 45% / 0.45)" strokeWidth="22" strokeLinecap="round" />
        <path d="M30 80 L 140 200 L 300 180 L 380 260" fill="none" stroke="hsl(var(--muted-foreground) / 0.25)" strokeWidth="6" />
        <path d="M60 440 L 180 300 L 340 420" fill="none" stroke="hsl(var(--muted-foreground) / 0.25)" strokeWidth="6" />
        <motion.path
          d="M90 110 C 150 170, 170 220, 210 250 S 290 330, 300 390"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="1 0"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, ease: "easeInOut", delay: 0.4 }}
        />
        <circle cx="90" cy="110" r="10" fill="hsl(var(--background))" stroke="hsl(var(--primary))" strokeWidth="5" />
        <rect x="290" y="380" width="20" height="20" rx="4" fill="hsl(var(--primary))" />
      </svg>
      <div className="absolute left-6 top-6 rounded-lg border bg-background/90 px-3 py-2 text-sm backdrop-blur">
        <span className="text-muted-foreground">Départ</span>
        <p className="font-semibold">{from}</p>
      </div>
      <div className="absolute bottom-24 right-6 rounded-lg border bg-background/90 px-3 py-2 text-right text-sm backdrop-blur">
        <span className="text-muted-foreground">Arrivée</span>
        <p className="font-semibold">{to}</p>
      </div>
      <div className="absolute inset-x-6 bottom-6 flex items-center justify-between rounded-xl border bg-background/90 p-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-full bg-primary/15 text-sm font-bold text-primary">KB</div>
          <div className="text-sm">
            <p className="font-semibold">Chauffeur fictif</p>
            <p className="text-muted-foreground">Arrivée estimée : démo</p>
          </div>
        </div>
        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-muted-foreground">Démo</span>
      </div>
    </div>
  );
}
