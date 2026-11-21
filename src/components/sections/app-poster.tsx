// App poster (after the davinova.com "install the app" block): install steps on the left, a phone with the
// real app screen on a podium in the middle, floating tiles around it, a "scan to install" QR code under it,
// and why the app on the right. One for passengers (home page), one for drivers (Chauffeurs page).
// No install button on purpose: the site is installed from the browser menu (see install-prompt.tsx).
import type { LucideIcon } from "lucide-react";
import { Bell, Car, Clock, Coins, Download, MapPin, ShieldCheck, Smartphone, Share, Zap } from "lucide-react";
import passengerScreen from "@/assets/app-passenger.webp";
import driverScreen from "@/assets/app-driver.webp";
import { PLACE_PHOTOS } from "@/lib/place-photos";

type Role = "passenger" | "driver";
type Card = { icon: LucideIcon; title: string; text: string };
type Tile = { photo?: string; kicker?: string; title?: string };

const CONTENT: Record<Role, { tag: string; title: string; screen: string; qr: string; url: string; why: Card[]; tiles: Tile[] }> = {
  passenger: {
    tag: "L'app passager",
    title: "Votre trajet, à un geste de l'écran d'accueil.",
    screen: passengerScreen,
    qr: "/qr/passager.svg",
    url: "davigoo.com",
    why: [
      { icon: Zap, title: "Plus rapide", text: "S'ouvre en plein écran en une seconde, même avec peu de réseau." },
      { icon: MapPin, title: "Vos trajets", text: "Estimation, suivi du chauffeur et historique à portée de main." },
      { icon: Bell, title: "Prévenu en premier", text: "L'ouverture du pilote et les nouveautés en notification." },
      { icon: ShieldCheck, title: "Chauffeurs vérifiés", text: "Carte VTC, assurance et véhicule contrôlés avant le départ." },
    ],
    tiles: [
      { photo: PLACE_PHOTOS.viotte?.uri },
      { photo: PLACE_PHOTOS.citadelle?.uri },
      { kicker: "Prix affiché", title: "Avant de réserver" },
      { photo: PLACE_PHOTOS.battant?.uri },
      { kicker: "Pilote", title: "Besançon" },
      { photo: PLACE_PHOTOS.tgv?.uri },
    ],
  },
  driver: {
    tag: "L'app chauffeur",
    title: "Vos courses et vos gains, dans votre poche.",
    screen: driverScreen,
    qr: "/qr/chauffeur.svg",
    url: "davigoo.com/chauffeurs",
    why: [
      { icon: Car, title: "En ligne en un geste", text: "Passez en ligne quand vous voulez, acceptez ou refusez une course." },
      { icon: Coins, title: "Vos gains du jour", text: "Courses terminées et gains estimés, mis à jour en direct." },
      { icon: Clock, title: "Itinéraire guidé", text: "Prise en charge et destination ouvertes dans votre GPS." },
      { icon: Bell, title: "Nouvelles demandes", text: "Prévenu dès qu'un passager réserve près de vous." },
    ],
    tiles: [
      { photo: PLACE_PHOTOS.viotte?.uri },
      { kicker: "Aujourd'hui", title: "5 / 8 courses" },
      { photo: PLACE_PHOTOS.chu?.uri },
      { kicker: "Gains estimés", title: "≈ 142 €" },
      { photo: PLACE_PHOTOS.tgv?.uri },
      { kicker: "Commission", title: "Fixée avec vous" },
    ],
  },
};

const STEPS: Card[] = [
  { icon: Smartphone, title: "Android", text: "Ouvrez davigoo.com dans Chrome, menu ⋮ puis « Installer l'application »." },
  { icon: Share, title: "iPhone", text: "Dans Safari, touchez Partager puis « Sur l'écran d'accueil »." },
  { icon: Download, title: "Sans store", text: "Gratuit, léger et toujours à jour." },
];

function GlassRow({ icon: Icon, title, text }: Card) {
  return (
    <li className="poster-card flex items-start gap-4 p-4 sm:p-5">
      <span className="grid size-11 shrink-0 place-items-center rounded-[12px] border border-white/60 bg-gradient-to-b from-[#f4e7d6] to-[#d9c2a5] text-[#3a2a1e] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
        <Icon className="size-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-lg font-semibold text-[#fbf5ee]">{title}</span>
        <span className="mt-0.5 block text-sm leading-snug text-[#eadccb]">{text}</span>
      </span>
    </li>
  );
}

function FloatTile({ tile, className }: { tile: Tile; className: string }) {
  return (
    <div className={`poster-tile absolute overflow-hidden ${tile.photo ? "" : "z-10"} ${className}`} aria-hidden>
      {tile.photo ? (
        <img src={tile.photo} alt="" loading="lazy" onError={(e) => (e.currentTarget.style.visibility = "hidden")} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full flex-col justify-end gap-1 p-2.5">
          <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-[#d9c8b4]">{tile.kicker}</span>
          <span className="font-display text-lg leading-[1.05] text-[#fbf5ee]">{tile.title}</span>
        </div>
      )}
    </div>
  );
}

export function AppPoster({ role }: { role: Role }) {
  const c = CONTENT[role];
  const t = c.tiles;
  return (
    <section id={role === "driver" ? "app-chauffeur" : "app"} aria-labelledby={`poster-${role}`} className="app-poster relative overflow-hidden py-16 sm:py-20">
      <div className="container relative">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">{c.tag}</p>
          <h2 id={`poster-${role}`} className="font-display mx-auto mt-3 max-w-2xl text-4xl leading-[1.05] sm:text-5xl">{c.title}</h2>
        </div>

        <div className="mt-10 grid items-center gap-8 lg:grid-cols-[1fr_minmax(0,26rem)_1fr] lg:gap-10">
          {/* Stage: phone on a podium, floating tiles, QR code. */}
          <div className="poster-stage relative order-1 mx-auto w-full max-w-[26rem] px-4 pb-5 pt-6 lg:order-2">
            <p className="text-center text-sm text-[#d9c8b4]">Toujours à un geste de votre écran d'accueil.</p>
            <div className="relative mx-auto mt-4 h-[25rem] sm:h-[27rem]">
              <FloatTile tile={t[0]} className="left-0 top-2 h-24 w-20 -rotate-6" />
              <FloatTile tile={t[1]} className="left-0 top-[8.5rem] h-[5.5rem] w-24 rotate-3" />
              <FloatTile tile={t[2]} className="bottom-12 left-0 h-[5.5rem] w-24 -rotate-3" />
              <FloatTile tile={t[3]} className="right-0 top-0 h-24 w-24 rotate-3" />
              <FloatTile tile={t[4]} className="right-0 top-[8.5rem] h-[5.5rem] w-24 -rotate-3" />
              <FloatTile tile={t[5]} className="bottom-12 right-0 h-24 w-20 rotate-6" />
              {/* podium */}
              <div className="absolute inset-x-10 bottom-0 h-10 rounded-[50%] bg-gradient-to-b from-[#f3e6d4] to-[#cdb497] shadow-[0_18px_30px_-10px_rgba(0,0,0,0.6)]" />
              <div className="absolute inset-x-14 bottom-4 h-8 rounded-[50%] bg-gradient-to-b from-[#fbf3e8] to-[#e2cfb6]" />
              {/* phone */}
              <div className="poster-phone absolute bottom-8 left-1/2 w-[11.5rem] sm:w-[12.5rem]">
                <div className="relative overflow-hidden rounded-[1.9rem] border-[6px] border-[#1d1510] bg-[#1d1510] shadow-[0_30px_50px_-20px_rgba(0,0,0,0.8),inset_0_0_0_1px_rgba(255,255,255,0.15)]">
                  <span className="absolute left-1/2 top-1.5 z-10 h-4 w-14 -translate-x-1/2 rounded-full bg-[#1d1510]" />
                  <img src={c.screen} alt={role === "driver" ? "L'app DaviGoo côté chauffeur" : "L'app DaviGoo côté passager"} loading="lazy" className="block aspect-[390/844] w-full object-cover object-top" />
                </div>
              </div>
            </div>
            {/* QR */}
            <div className="mt-6 flex items-center gap-4 rounded-[18px] border border-white/15 bg-white/[0.07] p-3 shadow-[inset_0_1px_0_rgba(255,245,230,0.18)]">
              <img src={c.qr} alt={`QR code vers ${c.url}`} width={88} height={88} className="size-[5.5rem] shrink-0 rounded-[10px] bg-[#fbf5ee] p-1.5" />
              <div className="min-w-0">
                <p className="font-display text-2xl uppercase leading-none tracking-[0.08em] text-[#fbf5ee]">Scanner pour installer</p>
                <p className="mt-1.5 text-xs text-[#d9c8b4]">Gratuit sur Android et iPhone. Sans store.</p>
                <span className="mt-2 inline-block rounded-full bg-gradient-to-b from-[#f4e7d6] to-[#d9c2a5] px-3 py-0.5 text-xs font-semibold text-[#3a2a1e]">{c.url}</span>
              </div>
            </div>
          </div>

          <div className="order-2 lg:order-1">
            <h3 className="mb-3 text-center font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">Installer en deux gestes</h3>
            <ul className="grid gap-3">{STEPS.map((s) => <GlassRow key={s.title} {...s} />)}</ul>
          </div>
          <div className="order-3">
            <h3 className="mb-3 text-center font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">Pourquoi l'app</h3>
            <ul className="grid gap-3">{c.why.map((s) => <GlassRow key={s.title} {...s} />)}</ul>
          </div>
        </div>
      </div>
    </section>
  );
}

