import { ArrowRight } from "lucide-react";
import { Header, type SitePage } from "@/components/ui/header-1";
import FooterSection from "@/components/ui/footer";
import { buttonVariants } from "@/components/ui/button";

// Frame shared by the menu pages: header with the page's tab raised, a glass page title, the content,
// a closing call to action and the footer.
export function PageShell({
  current,
  tag,
  title,
  intro,
  children,
}: {
  current: SitePage;
  tag: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Header current={current} />
      <main>
        <section className="container pt-6 sm:pt-10">
          <div className="lg-panel relative overflow-hidden px-6 py-12 sm:px-12 sm:py-16">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/70">{tag}</p>
            <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[0.95] sm:text-7xl">{title}</h1>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/#liste-attente" className={buttonVariants({ variant: "glassStrong", size: "lg" })}>
                Rejoindre la liste
              </a>
              <a href="/app.html" className={buttonVariants({ variant: "glass", size: "lg" })}>
                Voir l'app
              </a>
            </div>
          </div>
        </section>
        {children}
        <NextSteps current={current} />
      </main>
      <FooterSection />
    </>
  );
}

const PAGES: { page: SitePage; title: string; text: string; href: string }[] = [
  { page: "fonctionnement", title: "Comment ça marche", text: "Trois étapes, un prix affiché avant de partir.", href: "/comment-ca-marche.html" },
  { page: "trajets", title: "Trajets", text: "Gares, soirées, CHU, campus : les trajets du pilote.", href: "/trajets.html" },
  { page: "securite", title: "Sécurité", text: "Chauffeurs contrôlés, passagers vérifiés.", href: "/securite.html" },
  { page: "chauffeurs", title: "Chauffeurs", text: "Conduire pour une plateforme de votre ville.", href: "/chauffeurs.html" },
  { page: "faq", title: "FAQ", text: "Prix, zone, paiement, données.", href: "/faq.html" },
];

/** Glass tiles that lead to the menu pages (all but the current one). */
export function ExploreTiles({ current, title = "Continuer la visite" }: { current?: SitePage; title?: string }) {
  return (
    <section className="container py-16">
      <h2 className="font-display text-4xl sm:text-5xl">{title}</h2>
      <ul className={`mt-8 grid grid-cols-2 gap-5 ${current ? "lg:grid-cols-4" : "lg:grid-cols-5"}`}>
        {PAGES.filter((p) => p.page !== current).map((p) => (
          <li key={p.page}>
            <a href={p.href} className="lg group flex h-full flex-col justify-between gap-4 !rounded-[18px] p-4 sm:gap-6 sm:p-6">
              <span>
                <span className="block text-base font-semibold leading-tight sm:text-xl">{p.title}</span>
                <span className="mt-1 block text-xs text-white/95 sm:text-sm">{p.text}</span>
              </span>
              <ArrowRight className="size-5 transition group-hover:translate-x-1" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function NextSteps({ current }: { current: SitePage }) {
  return (
    <>
      <ExploreTiles current={current} />
      <section className="container pb-20">
        <div className="lg-panel flex flex-col items-start justify-between gap-6 px-6 py-10 sm:flex-row sm:items-center sm:px-10">
          <div>
            <p className="font-display text-3xl sm:text-4xl">Soyez du premier trajet.</p>
            <p className="mt-2 text-muted-foreground">Le pilote ouvre bientôt à Besançon. Laissez votre e-mail, nous vous prévenons.</p>
          </div>
          <a href="/#liste-attente" className={buttonVariants({ variant: "glassStrong", size: "lg" })}>
            Rejoindre la liste <ArrowRight className="size-4" />
          </a>
        </div>
      </section>
    </>
  );
}
