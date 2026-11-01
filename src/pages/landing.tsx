import { Clock3, GraduationCap, Luggage, Moon, Stethoscope, TrainFront } from "lucide-react";
import { Header } from "@/components/ui/header-1";
import { RideBookingForm } from "@/components/ui/ride-booking-form";
import Features from "@/components/ui/features-01";
import FooterSection from "@/components/ui/footer";
import { DepartureBoard } from "@/components/sections/departure-board";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Security } from "@/components/sections/security";
import { Drivers } from "@/components/sections/drivers";
import { AppTeaser } from "@/components/sections/app-teaser";
import { Faq } from "@/components/sections/faq";
import { Waitlist } from "@/components/sections/waitlist";

const useCases = [
  { icon: TrainFront, title: "Gares Viotte et Besançon TGV", description: "Rejoindre Auxon ou Viotte sans chercher de place ni rater le train.", footnote: "Centre → TGV · ≈ 12 km" },
  { icon: Moon, title: "Soirées", description: "Rentrer de Battant ou du centre quand les bus se font rares.", footnote: "Horaires à définir" },
  { icon: Stethoscope, title: "CHU Minjoz", description: "Rendez-vous médicaux et visites, avec un trajet planifié à l'avance.", footnote: "Accessibilité à préciser" },
  { icon: GraduationCap, title: "La Bouloie, Témis, Micropolis", description: "Des trajets courts et réguliers entre campus, zones d'activité et salons.", footnote: "Demande à mesurer" },
  { icon: Luggage, title: "Bagages et groupes", description: "Un van jusqu'à 7 places pour les familles et les valises.", footnote: "Catégorie à confirmer" },
  { icon: Clock3, title: "Immédiat ou planifié", description: "Réserver maintenant ou la veille, avec un prix affiché avant de confirmer.", footnote: "Mode à trancher" },
];

export default function Landing() {
  return (
    <>
      <Header />
      <main>
        <section className="pb-20 pt-10 sm:pt-14">
          <div className="container grid items-start gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <div>
              <p className="font-mono text-xs text-muted-foreground">47°14′N · 6°01′E — VTC local, en préparation</p>
              <h1 className="font-wide mt-5 text-[3.1rem] font-black leading-[0.92] tracking-tight sm:text-7xl xl:text-[5.5rem]">
                Besançon,
                <br />
                <span className="text-primary">à l'heure.</span>
              </h1>
              <p className="mt-6 max-w-lg text-lg text-muted-foreground">
                MOVA met en relation les Bisontins avec des chauffeurs VTC indépendants de la ville. Prix connu avant de partir,
                chauffeurs vérifiés, support local.
              </p>
              <RideBookingForm className="mt-9" />
            </div>
            <div className="lg:pt-24">
              <DepartureBoard />
            </div>
          </div>
        </section>
        <Waitlist />
        <HowItWorks />
        <Features
          id="trajets"
          tag="02 · Trajets"
          title="Les trajets que nous voulons tester"
          subtitle="Nous ne présumons pas la demande : ces usages seront mesurés pendant le pilote."
          features={useCases}
        />
        <Security />
        <Drivers />
        <AppTeaser />
        <Faq />
      </main>
      <FooterSection />
    </>
  );
}
