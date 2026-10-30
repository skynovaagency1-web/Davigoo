import * as React from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const perks = [
  "Clientèle locale bisontine, sans démarchage",
  "Téléphone géré avec forfait data envisagé pour les chauffeurs pilotes",
  "Liberté d'accepter ou de refuser une course",
  "Support humain local et procédure de contestation",
];

const input =
  "w-full rounded-md border bg-background px-3.5 py-2.5 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring";

export function Drivers() {
  const [sent, setSent] = React.useState(false);

  return (
    <section id="chauffeurs" className="scroll-mt-24 border-y bg-card/40 py-20">
      <div className="container grid items-start gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Chauffeurs VTC</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Rejoignez le pilote MOVA à Besançon</h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Nous cherchons quelques chauffeurs VTC indépendants pour co-construire le service et mesurer la demande locale.
          </p>
          <ul className="mt-8 grid gap-3">
            {perks.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            Conditions (statut, rémunération, commission, matériel) en cours de définition avec des conseils juridiques.
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-xl sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold">Manifester votre intérêt</h3>
            <span className="rounded-full bg-primary/15 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-primary">Démo</span>
          </div>
          <div className="mt-4 rounded-lg border-l-4 border-warning bg-warning/10 p-3 text-sm text-muted-foreground">
            <strong className="text-foreground">Rien n'est envoyé.</strong> N'ajoutez aucun document d'identité, carte VTC ou
            attestation d'assurance : ils seront collectés plus tard via un espace sécurisé.
          </div>
          {sent ? (
            <div className="mt-6 rounded-lg bg-success/10 p-5 text-center" aria-live="polite">
              <CheckCircle2 className="mx-auto size-8 text-success" />
              <p className="mt-2 font-semibold">Merci ! (simulation)</p>
              <p className="text-sm text-muted-foreground">Aucune donnée n'a quitté votre navigateur.</p>
              <Button variant="outline" className="mt-4" onClick={() => setSent(false)}>
                Recommencer
              </Button>
            </div>
          ) : (
            <form
              className="mt-6 grid gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5 text-sm font-medium text-muted-foreground">
                  Prénom
                  <input required className={input} placeholder="Camille" autoComplete="off" />
                </label>
                <label className="grid gap-1.5 text-sm font-medium text-muted-foreground">
                  Commune
                  <input className={input} placeholder="Besançon" autoComplete="off" />
                </label>
              </div>
              <label className="grid gap-1.5 text-sm font-medium text-muted-foreground">
                Disponibilités envisagées
                <select className={input} defaultValue="soirs">
                  <option value="jour">En journée</option>
                  <option value="soirs">Soirs et week-ends</option>
                  <option value="mixte">Variable</option>
                </select>
              </label>
              <label className="flex items-start gap-3 text-sm text-muted-foreground">
                <input type="checkbox" required className="mt-1 size-4 accent-[hsl(var(--primary))]" />
                Je possède une carte professionnelle VTC valide (déclaratif, non vérifié dans cette démo).
              </label>
              <Button type="submit" size="lg">
                Envoyer (démo)
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
