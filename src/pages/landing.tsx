import { Header } from "@/components/ui/header-1";
import { Hero } from "@/components/sections/hero";
import { RideBookingForm } from "@/components/ui/ride-booking-form";
import FooterSection from "@/components/ui/footer";
import { DepartureBoard } from "@/components/sections/departure-board";
import { AppTeaser } from "@/components/sections/app-teaser";
import { Waitlist } from "@/components/sections/waitlist";
import { Places } from "@/components/sections/places";
import { ExploreTiles } from "@/components/page-shell";
import touch from "@/assets/touch.jpg";
import globe from "@/assets/globe.jpg";

export default function Landing() {
  return (
    <>
      <Header />
      <main>
        <Hero />

        <section className="container grid gap-8 py-16 sm:py-20 lg:grid-cols-2 lg:gap-16">
          <h2 className="font-display text-4xl uppercase leading-[1.05] tracking-[0.14em] sm:text-5xl">
            Des chauffeurs
            <br />d'ici.
          </h2>
          <p className="max-w-md text-lg leading-relaxed text-muted-foreground lg:justify-self-end">
            DaviGoo met en relation les Bisontins avec des chauffeurs VTC indépendants de la ville. Prix connu avant de partir,
            chauffeurs vérifiés, support local.
          </p>
        </section>

        <PhotoStrip />

        <Places />

        <section className="pb-20 pt-16">
          <div className="container grid items-start gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Estimer un trajet</p>
              <RideBookingForm className="mt-6" />
            </div>
            <div className="lg:pt-10">
              <DepartureBoard />
            </div>
          </div>
        </section>
        <ExploreTiles title="Découvrir DaviGoo" />
        <Waitlist />
        <AppTeaser />
      </main>
      <FooterSection />
    </>
  );
}

// Row of soft, slightly turned photo cards, after the moodboard the founder chose.
function PhotoStrip() {
  const cards = [
    { kind: "img" as const, src: touch, pos: "50% 30%", rot: "-rotate-[5deg]", h: "h-64 sm:h-80" },
    { kind: "text" as const, title: "Prix connu", text: "Affiché avant de confirmer, sans surprise à l'arrivée.", tone: "bg-[#2c251d] text-[#f4efea]", rot: "rotate-[2deg]", h: "h-56 sm:h-72" },
    { kind: "img" as const, src: globe, pos: "62% 45%", rot: "-rotate-[1deg]", h: "h-72 sm:h-96" },
    { kind: "text" as const, title: "Chauffeurs vérifiés", text: "Carte VTC, assurance et véhicule contrôlés par l'équipe.", tone: "glass-sand text-foreground", rot: "rotate-[4deg]", h: "h-56 sm:h-72" },
    { kind: "img" as const, src: touch, pos: "50% 75%", rot: "-rotate-[3deg]", h: "h-64 sm:h-80" },
  ];
  return (
    <section aria-label="L'esprit DaviGoo" className="snap-x overflow-x-auto py-10 [scrollbar-width:none]">
      <div className="mx-auto flex w-max items-center gap-5 px-6 sm:gap-7">
        {cards.map((c, i) => (
          <div key={i} className={`snap-center ${c.rot} ${c.h} w-44 shrink-0 overflow-hidden rounded-[1.75rem] shadow-[0_24px_50px_-20px_rgba(90,70,50,0.45)] sm:w-60`}>
            {c.kind === "img" ? (
              <img src={c.src} alt="" loading="lazy" className="h-full w-full object-cover" style={{ objectPosition: c.pos }} />
            ) : (
              <div className={`${c.tone} flex h-full flex-col justify-end gap-2 p-6`}>
                <p className="font-display text-3xl leading-none">{c.title}</p>
                <p className="text-sm opacity-75">{c.text}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
