import { ChevronRight } from "lucide-react";

// Home hero, laid out like resend.com: announcement pill, large serif headline with a fading gradient,
// short subline, a glass button plus a quiet text button, and the logo film playing on the right
// (the car drives in, shatters and reforms as DAVIGOO). Clicking the film replays it.
export function Hero() {
  return (
    <section className="container pt-4">
      <div className="hero-dark relative isolate overflow-hidden rounded-[2rem] bg-[#100d0a] text-[#f1eae2]">
        {/* Spotlight from the top right and a curved floor light, like Resend's stage */}
        <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 -z-10 size-[44rem] rounded-full bg-[radial-gradient(closest-side,rgba(205,182,158,0.18),transparent)]" />
        <div aria-hidden className="pointer-events-none absolute -bottom-[38rem] left-1/2 -z-10 h-[46rem] w-[160%] -translate-x-1/2 rounded-[100%] border-t border-[#cdb69e]/25 bg-[radial-gradient(ellipse_at_top,rgba(205,182,158,0.12),transparent_55%)]" />

        <div className="grid min-h-[600px] items-center gap-4 px-6 pb-12 pt-6 sm:px-10 lg:min-h-[700px] lg:grid-cols-[1fr_1.05fr] lg:gap-0 lg:px-16 lg:py-0">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <a href="#liste-attente" className="hero-badge group inline-flex items-center gap-1 rounded-full py-1.5 pl-3.5 pr-2.5 text-sm text-[#f1eae2]">
              Bientôt à Besançon · liste d'attente ouverte
              <ChevronRight className="size-3.5 transition group-hover:translate-x-0.5" />
            </a>

            <h1 className="hero-title mt-7 pb-3 font-display text-[4rem] font-normal leading-[0.95] tracking-[-0.01em] sm:text-[5.25rem] lg:text-[6rem]">
              Votre trajet,
              <br />à l'heure.
            </h1>

            <p className="mt-3 max-w-[30rem] text-lg leading-relaxed text-[#a8a09a]">
              Des chauffeurs VTC indépendants et vérifiés, à Besançon.
              <br className="hidden sm:block" /> Le prix est affiché avant de partir.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <a
                href="#liste-attente"
                className="inline-flex h-12 items-center rounded-2xl border-2 border-white/5 bg-[linear-gradient(104deg,rgba(253,253,253,0.06)_5%,rgba(240,228,214,0.12))] px-5 font-semibold text-white shadow-sm backdrop-blur transition hover:bg-white/15"
              >
                Rejoindre la liste
              </a>
              <a href="/app.html" className="inline-flex h-12 items-center rounded-2xl px-5 font-semibold text-[#a8a09a] transition hover:text-white">
                Voir l'app
              </a>
            </div>
          </div>

          <div className="relative order-first h-[240px] w-full [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_62%,transparent)] sm:h-[360px] lg:order-none lg:h-[560px] lg:[mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent)]">
            <iframe
              src={`${import.meta.env.BASE_URL}intro.html?embed=1`}
              title="Logo DaviGoo animé"
              className="absolute inset-0 h-full w-full border-0 bg-transparent"
              style={{ colorScheme: "normal" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
