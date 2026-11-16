import * as React from "react";
import { BellRing, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConsentCheckbox, glassInputClass as inputClass } from "@/components/ui/consent";
import { SIGNUP_ERROR, submitSignup } from "@/lib/signups";
import { NotifyButton } from "@/components/ui/notify-button";

const USES = ["Gare / train", "Soirées", "Rendez-vous médicaux", "Trajets du quotidien", "Aéroport", "Autre"];

export function Waitlist() {
  const [state, setState] = React.useState<"idle" | "sending" | "sent" | "error">("idle");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setState("sending");
    try {
      await submitSignup({
        kind: "passenger",
        email: String(f.get("email")),
        first_name: String(f.get("first_name") ?? ""),
        commune: String(f.get("commune") ?? ""),
        details: String(f.get("use") ?? ""),
        consent: true,
      });
      setState("sent");
    } catch {
      setState("error");
    }
  };

  return (
    <section id="liste-attente" className="scroll-mt-24 py-16 text-foreground sm:py-20">
      <div className="container">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <p className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <BellRing className="size-4 text-signal" /> Liste d'attente
            </p>
            <h2 className="font-wide mt-4 text-4xl font-black leading-[0.95] tracking-tight sm:text-5xl">Soyez du premier trajet.</h2>
            <p className="mt-4 max-w-md text-lg text-muted-foreground">
              Inscrivez-vous pour être parmi les premiers passagers du pilote. Dites-nous quels trajets vous intéressent :
              cela nous aide à choisir la zone et les horaires.
            </p>
          </div>

          {state === "sent" ? (
            <div className="lg-panel p-6 text-center text-foreground" aria-live="polite">
              <CheckCircle2 className="mx-auto size-9 text-success" />
              <p className="mt-2 text-lg font-semibold">C'est noté, merci !</p>
              <p className="text-muted-foreground">Nous vous écrirons dès l'ouverture du pilote.</p>
              <NotifyButton className="mt-5" />
            </div>
          ) : (
            <form onSubmit={onSubmit} className="lg-panel grid gap-4 p-5 text-foreground sm:p-7">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5 text-sm font-medium text-foreground/80">
                  E-mail *
                  <input id="wl-email" name="email" type="email" required maxLength={200} autoComplete="email" className={inputClass} placeholder="vous@exemple.fr" />
                </label>
                <label className="grid gap-1.5 text-sm font-medium text-foreground/80">
                  Prénom
                  <input id="wl-first-name" name="first_name" maxLength={80} autoComplete="given-name" className={inputClass} placeholder="Camille" />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5 text-sm font-medium text-foreground/80">
                  Commune / quartier
                  <input id="wl-commune" name="commune" maxLength={80} className={inputClass} placeholder="Besançon, Battant…" />
                </label>
                <label className="grid gap-1.5 text-sm font-medium text-foreground/80">
                  Trajet principal
                  <select id="wl-use" name="use" className={inputClass} defaultValue={USES[0]}>
                    {USES.map((u) => (
                      <option key={u}>{u}</option>
                    ))}
                  </select>
                </label>
              </div>
              <ConsentCheckbox id="wl-consent" />
              <Button type="submit" size="lg" variant="glassStrong" disabled={state === "sending"}>
                {state === "sending" && <Loader2 className="size-4 animate-spin" />}
                M'inscrire
              </Button>
              {state === "error" && (
                <p role="alert" className="text-sm font-medium text-warning">
                  {SIGNUP_ERROR}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
