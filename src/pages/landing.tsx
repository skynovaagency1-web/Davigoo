import { Clock3, Moon, Stethoscope, TrainFront, GraduationCap, Luggage } from "lucide-react";
import { Header } from "@/components/ui/header-1";
import { RideBookingForm } from "@/components/ui/ride-booking-form";
import Features from "@/components/ui/features-01";
import FooterSection from "@/components/ui/footer";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Security } from "@/components/sections/security";
import { Drivers } from "@/components/sections/drivers";
import { AppTeaser } from "@/components/sections/app-teaser";
import { Faq } from "@/components/sections/faq";

const useCases = [
  { icon: TrainFront, title: "Gares Viotte & TGV", description: "Rejoindre la gare Besançon Franche-Comté TGV à Auxon ou Viotte sans chercher de place.", footnote: "Exemple fictif : Centre → Gare TGV" },
  { icon: Moon, title: "Soirées", description: "Rentrer de Battant ou du centre en fin de soirée, quand les bus se font rares.", footnote: "Horaires du pilote à définir" },
  { icon: Stethoscope, title: "CHU Minjoz", description: "Rendez-vous médicaux et visites, avec trajet planifié à l'avance.", footnote: "Accessibilité à préciser" },
  { icon: GraduationCap, title: "Campus & Témis", description: "La Bouloie, Témis, Micropolis : des trajets courts et réguliers.", footnote: "Demande à mesurer" },
  { icon: Luggage, title: "Bagages & groupes", description: "Catégorie Van jusqu'à 7 places pour les familles et les valises.", footnote: "Catégories à confirmer" },
  { icon: Clock3, title: "Planifié ou immédiat", description: "Réserver maintenant ou à l'avance, avec une estimation avant de confirmer.", footnote: "Mode de réservation à trancher" },
];

export default function Landing() {
  return (
    <>
      <Header />
      <main>
        <section className="relative overflow-hidden py-12 sm:py-16">
          <div className="pointer-events-none absolute -right-40 -top-40 size-[640px] rounded-full bg-primary/15 blur-3xl" />
          <div className="container relative">
            <RideBookingForm />
          </div>
        </section>
        <HowItWorks />
        <Features
          id="trajets"
          eyebrow="Pensé pour Besançon"
          title="Les trajets que nous voulons tester"
          subtitle="Nous ne présumons pas la demande : ces cas d'usage seront mesurés pendant le pilote."
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
