import { CarFront, MapPinned, Receipt } from "lucide-react";

const steps = [
  { icon: MapPinned, title: "Indiquez votre trajet", text: "Départ, destination, heure : immédiat ou planifié. Vous voyez une estimation avant de confirmer." },
  { icon: CarFront, title: "Un chauffeur local accepte", text: "Un chauffeur VTC indépendant et vérifié accepte la course. Vous suivez son arrivée." },
  { icon: Receipt, title: "Payez et recevez le reçu", text: "Paiement via un prestataire agréé, reçu envoyé après la course, assistance en cas de souci." },
];

export function HowItWorks() {
  return (
    <section id="fonctionnement" className="scroll-mt-24 border-y bg-card/40 py-20">
      <div className="container">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Comment ça marche</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Trois étapes, sans surprise</h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Le parcours visé pour le pilote. Aujourd'hui, ces étapes sont simulées dans le prototype.
          </p>
        </div>
        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="relative rounded-xl border bg-card p-6">
              <span className="absolute right-5 top-4 text-5xl font-extrabold text-border">{i + 1}</span>
              <div className="mb-5 grid size-11 place-items-center rounded-lg bg-primary text-primary-foreground">
                <s.icon className="size-5" />
              </div>
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="mt-1 text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
