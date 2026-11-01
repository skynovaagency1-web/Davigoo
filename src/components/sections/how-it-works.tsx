import { SectionHeading } from "@/components/ui/section-heading";

const stops = [
  { time: "00:00", title: "Vous indiquez le trajet", text: "Départ, arrivée, maintenant ou plus tard. Le prix s'affiche avant de confirmer." },
  { time: "+01:30", title: "Un chauffeur accepte", text: "Un chauffeur VTC indépendant et vérifié prend la course. Vous suivez son arrivée." },
  { time: "+12:00", title: "Vous arrivez, vous payez", text: "Paiement par un prestataire agréé, reçu par e-mail, assistance si besoin." },
];

export function HowItWorks() {
  return (
    <section id="fonctionnement" className="scroll-mt-24 py-20">
      <div className="container">
        <SectionHeading tag="01 · Le trajet" title="Trois arrêts, sans surprise">
          Le parcours visé pour le pilote. Pour l'instant, il est simulé dans le prototype.
        </SectionHeading>
        <ol className="relative mt-12 grid gap-10 md:ml-[12rem] md:grid-cols-3 md:gap-6">
          <span aria-hidden className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-0.5 bg-primary/25 md:left-0 md:top-[7px] md:h-0.5 md:w-full" />
          {stops.map((s, i) => (
            <li key={s.title} className="relative pl-9 md:pl-0 md:pt-9">
              <span
                aria-hidden
                className={`absolute left-0 top-0.5 size-4 rounded-full border-[3px] border-primary md:top-0 ${i === stops.length - 1 ? "bg-primary" : "bg-background"}`}
              />
              <p className="font-mono text-xs text-primary tnum">{s.time}</p>
              <h3 className="mt-1 text-lg font-bold">{s.title}</h3>
              <p className="mt-1 text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
