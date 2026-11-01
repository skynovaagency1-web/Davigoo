import * as React from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { ConsentCheckbox, inputClass } from "@/components/ui/consent";
import { SIGNUP_ERROR, submitSignup } from "@/lib/signups";

const perks = [
  "Clientèle locale bisontine, sans démarchage",
  "Téléphone géré avec forfait data envisagé pour les chauffeurs pilotes",
  "Liberté d'accepter ou de refuser une course",
  "Support humain local et procédure de contestation",
];

export function Drivers() {
  const [state, setState] = React.useState<"idle" | "sending" | "sent" | "error">("idle");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setState("sending");
    try {
      await submitSignup({
        kind: "driver",
        email: String(f.get("email")),
        first_name: String(f.get("first_name") ?? ""),
        phone: String(f.get("phone") ?? ""),
        commune: String(f.get("commune") ?? ""),
        details: String(f.get("availability") ?? ""),
        has_vtc_card: f.get("vtc") === "on",
        consent: true,
      });
      setState("sent");
    } catch {
      setState("error");
    }
  };

  return (
    <section id="chauffeurs" className="scroll-mt-24 bg-board py-20 text-board-foreground">
      <div className="container">
        <SectionHeading invert tag="Chauffeurs VTC" title="Conduisez pour une plateforme de votre ville">
          Nous cherchons quelques chauffeurs VTC indépendants pour co-construire le service et mesurer la demande locale.
        </SectionHeading>
      <div className="mt-10 grid items-start gap-10 md:ml-[12rem] lg:grid-cols-2">
        <div>
          <ul className="grid gap-4">
            {perks.map((p) => (
              <li key={p} className="flex items-start gap-3 border-b border-board-foreground/10 pb-4">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-signal" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-board-foreground/60">
            Conditions (statut, rémunération, commission, matériel) en cours de définition avec des conseils juridiques.
          </p>
        </div>

        <div className="rounded-md bg-card p-6 text-foreground sm:p-8">
          <h3 className="text-lg font-semibold">Manifester votre intérêt</h3>
          <div className="mt-4 rounded-lg border-l-4 border-warning bg-warning/10 p-3 text-sm text-muted-foreground">
            <strong className="text-foreground">Aucun document pour l'instant.</strong> N'envoyez ni pièce d'identité, ni carte
            VTC, ni attestation d'assurance : ils seront demandés plus tard via un espace sécurisé.
          </div>
          {state === "sent" ? (
            <div className="mt-6 rounded-lg bg-success/10 p-5 text-center" aria-live="polite">
              <CheckCircle2 className="mx-auto size-8 text-success" />
              <p className="mt-2 font-semibold">Merci, votre intérêt est enregistré !</p>
              <p className="text-sm text-muted-foreground">Nous vous recontacterons pour un premier échange.</p>
            </div>
          ) : (
            <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5 text-sm font-medium text-muted-foreground">
                  Prénom *
                  <input id="dr-first-name" name="first_name" required maxLength={80} autoComplete="given-name" className={inputClass} placeholder="Camille" />
                </label>
                <label className="grid gap-1.5 text-sm font-medium text-muted-foreground">
                  Commune
                  <input id="dr-commune" name="commune" maxLength={80} className={inputClass} placeholder="Besançon" />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5 text-sm font-medium text-muted-foreground">
                  E-mail *
                  <input id="dr-email" name="email" type="email" required maxLength={200} autoComplete="email" className={inputClass} placeholder="vous@exemple.fr" />
                </label>
                <label className="grid gap-1.5 text-sm font-medium text-muted-foreground">
                  Téléphone
                  <input id="dr-phone" name="phone" type="tel" maxLength={30} autoComplete="tel" className={inputClass} placeholder="06 12 34 56 78" />
                </label>
              </div>
              <label className="grid gap-1.5 text-sm font-medium text-muted-foreground">
                Disponibilités envisagées
                <select id="dr-availability" name="availability" className={inputClass} defaultValue="Soirs et week-ends">
                  <option>En journée</option>
                  <option>Soirs et week-ends</option>
                  <option>Variable</option>
                </select>
              </label>
              <label htmlFor="dr-vtc" className="flex items-start gap-3 text-sm text-muted-foreground">
                <input id="dr-vtc" name="vtc" type="checkbox" className="mt-1 size-4 shrink-0 accent-[hsl(var(--primary))]" />
                Je possède une carte professionnelle VTC valide.
              </label>
              <ConsentCheckbox id="dr-consent" />
              <Button type="submit" size="lg" disabled={state === "sending"} className="bg-foreground text-background hover:bg-foreground/85">
                {state === "sending" && <Loader2 className="size-4 animate-spin" />}
                Envoyer
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
      </div>
    </section>
  );
}
