import { Banknote, BellRing, CalendarClock, Car, CheckCircle2, Eye, HeartHandshake, Headset, LockKeyhole, MapPinned, Route, Share2, Wallet } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Security } from "@/components/sections/security";
import { Drivers } from "@/components/sections/drivers";
import { Faq } from "@/components/sections/faq";
import { AppTeaser } from "@/components/sections/app-teaser";
import { Places } from "@/components/sections/places";
import { DepartureBoard } from "@/components/sections/departure-board";
import { RideBookingForm } from "@/components/ui/ride-booking-form";
import Features from "@/components/ui/features-01";
import { buttonVariants } from "@/components/ui/button";
import { useCases } from "@/lib/use-cases";

type Item = { icon: React.ComponentType<{ className?: string }>; title: string; text: string };

/** Row of glass cards, each with an icon, a title and a line of text. */
function GlassCards({ items, cols = 3 }: { items: Item[]; cols?: 2 | 3 }) {
  return (
    <ul className={`grid gap-5 sm:grid-cols-2 ${cols === 3 ? "lg:grid-cols-3" : ""}`}>
      {items.map((it) => (
        <li key={it.title} className="lg-panel p-6">
          <span className="lg lg-quiet inline-grid size-11 place-items-center">
            <it.icon className="size-5" />
          </span>
          <p className="mt-4 text-lg font-semibold">{it.title}</p>
          <p className="mt-1 text-muted-foreground">{it.text}</p>
        </li>
      ))}
    </ul>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="container py-12">
      <h2 className="mb-8 font-display text-4xl sm:text-5xl">{title}</h2>
      {children}
    </section>
  );
}

function Estimate() {
  return (
    <section className="container py-12">
      <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/70">Estimer un trajet</p>
          <RideBookingForm className="mt-5" />
        </div>
        <div className="lg:pt-10">
          <DepartureBoard />
        </div>
      </div>
    </section>
  );
}

export function HowPage() {
  return (
    <PageShell
      current="fonctionnement"
      tag="Comment ça marche"
      title="Votre trajet en trois étapes."
      intro="Vous indiquez le départ et l'arrivée, le prix s'affiche, un chauffeur vérifié accepte. Voici le parcours prévu pour le pilote à Besançon."
    >
      <HowItWorks />
      <Block title="Des deux côtés de la course">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="lg-panel p-6 sm:p-8">
            <p className="text-xl font-semibold">Côté passager</p>
            <ol className="mt-4 grid gap-3 text-muted-foreground">
              <li>1. Créez votre compte avec votre e-mail.</li>
              <li>2. Choisissez le départ, l'arrivée et l'heure, maintenant ou plus tard.</li>
              <li>3. Voyez le prix avant de confirmer, puis suivez le chauffeur sur la carte.</li>
              <li>4. Payez dans l'app et recevez le reçu par e-mail.</li>
            </ol>
          </div>
          <div className="lg-panel p-6 sm:p-8">
            <p className="text-xl font-semibold">Côté chauffeur</p>
            <ol className="mt-4 grid gap-3 text-muted-foreground">
              <li>1. Votre dossier (carte VTC, assurance, véhicule) est vérifié par l'équipe.</li>
              <li>2. Passez « en ligne » quand vous voulez conduire.</li>
              <li>3. Acceptez une course, l'itinéraire s'ouvre dans votre GPS.</li>
              <li>4. Le paiement vous est reversé par un prestataire agréé.</li>
            </ol>
          </div>
        </div>
      </Block>
      <Block title="Le prix, avant de partir">
        <GlassCards
          items={[
            { icon: Banknote, title: "Affiché d'avance", text: "Vous voyez le montant estimé avant de confirmer la course." },
            { icon: Wallet, title: "Paiement dans l'app", text: "Par un prestataire agréé, sans espèces à préparer." },
            { icon: CalendarClock, title: "Maintenant ou plus tard", text: "Réservez tout de suite ou la veille pour un train tôt." },
          ]}
        />
        <p className="mt-6 text-sm text-muted-foreground">Les tarifs du pilote sont en cours de définition : les montants affichés sur le site sont fictifs.</p>
      </Block>
      <Estimate />
      <AppTeaser />
    </PageShell>
  );
}

export function RidesPage() {
  return (
    <PageShell
      current="trajets"
      tag="Trajets"
      title="Les trajets du pilote."
      intro="Gares, soirées, rendez-vous au CHU, campus et zones d'activité : les usages que DaviGoo veut tester en premier à Besançon."
    >
      <Places />
      <Features id="usages" tag="Usages" title="Ce que nous voulons tester" subtitle="Nous ne présumons pas la demande : ces usages seront mesurés pendant le pilote." features={useCases} />
      <Estimate />
    </PageShell>
  );
}

export function SafetyPage() {
  return (
    <PageShell
      current="securite"
      tag="Sécurité"
      title="Des chauffeurs contrôlés, des passagers vérifiés."
      intro="Avant le pilote, chaque chauffeur est vérifié par l'équipe et chaque passager confirme son téléphone. Voici ce qui est prévu."
    >
      <Security heading={false} />
      <Block title="Pendant le trajet">
        <GlassCards
          items={[
            { icon: Eye, title: "Chauffeur identifié", text: "Nom, photo, véhicule et plaque affichés avant qu'il arrive." },
            { icon: MapPinned, title: "Suivi en direct", text: "Vous voyez la position du chauffeur jusqu'à la prise en charge." },
            { icon: Share2, title: "Trajet partageable", text: "Envoyez votre trajet à un proche (prévu pour le pilote)." },
            { icon: Headset, title: "Assistance locale", text: "Une équipe à Besançon joignable en cas de problème." },
            { icon: LockKeyhole, title: "Données protégées", text: "Comptes protégés et données limitées au strict nécessaire." },
            { icon: Car, title: "Véhicule contrôlé", text: "Carte grise, assurance et état du véhicule vérifiés." },
          ]}
        />
        <a href="/confidentialite.html" className={buttonVariants({ variant: "glass", className: "mt-8" })}>
          Lire la politique de confidentialité
        </a>
      </Block>
    </PageShell>
  );
}

export function DriversPage() {
  return (
    <PageShell
      current="chauffeurs"
      tag="Chauffeurs VTC"
      title="Conduisez pour une plateforme de votre ville."
      intro="DaviGoo cherche des chauffeurs VTC indépendants à Besançon pour le pilote. Laissez vos coordonnées, nous vous rappelons."
    >
      <Block title="Pourquoi DaviGoo">
        <GlassCards
          items={[
            { icon: HeartHandshake, title: "Une équipe locale", text: "Des interlocuteurs à Besançon, pas un centre d'appels lointain." },
            { icon: Route, title: "Vous gardez la main", text: "Passez en ligne quand vous voulez, refusez une course si besoin." },
            { icon: BellRing, title: "Votre avis compte", text: "Commission et règles du pilote discutées avec les premiers chauffeurs." },
          ]}
        />
      </Block>
      <Drivers heading={false} />
    </PageShell>
  );
}

export function FaqPage() {
  return (
    <PageShell
      current="faq"
      tag="FAQ"
      title="Questions fréquentes."
      intro="Réservation, zone, prix, paiement et données : ce que nous savons aujourd'hui, et ce qui reste à décider."
    >
      <Faq heading={false} />
      <section className="container pb-4">
        <div className="lg-panel flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-1 size-5 shrink-0" />
            <p className="text-muted-foreground">
              Une autre question ? L'adresse de contact sera publiée à l'ouverture. D'ici là, rejoignez la liste d'attente pour être prévenu.
            </p>
          </div>
          <a href="/#liste-attente" className={buttonVariants({ variant: "glassStrong" })}>
            Rejoindre la liste
          </a>
        </div>
      </section>
    </PageShell>
  );
}
