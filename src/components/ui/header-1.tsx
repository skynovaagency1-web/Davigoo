// Adapted from 21st.dev "Header 1" by efferd: sticky header with scroll blur and animated mobile menu.
import React from "react";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";

const links = [
  { label: "Comment ça marche", href: "/comment-ca-marche.html", page: "fonctionnement" },
  { label: "Trajets", href: "/trajets.html", page: "trajets" },
  { label: "Sécurité", href: "/securite.html", page: "securite" },
  { label: "Chauffeurs", href: "/chauffeurs.html", page: "chauffeurs" },
  { label: "FAQ", href: "/faq.html", page: "faq" },
];

export type SitePage = (typeof links)[number]["page"] | "home";

export function Header({ current = "home" }: { current?: SitePage }) {
  const scrolled = useScroll(10);
  const activeRef = React.useRef<HTMLAnchorElement>(null);

  // Phone: keep the page you are on visible in the sideways-scrolling tab bar.
  React.useEffect(() => {
    const el = activeRef.current;
    const bar = el?.parentElement;
    if (el && bar) bar.scrollLeft = el.offsetLeft - (bar.clientWidth - el.offsetWidth) / 2;
  }, []);

  const tabs = (phone: boolean) =>
    links.map((link) => (
      <a
        key={link.label}
        href={link.href}
        ref={phone && current === link.page ? activeRef : undefined}
        aria-current={current === link.page ? "page" : undefined}
        className={cn(
          "shrink-0 whitespace-nowrap px-3.5 py-1.5 text-sm font-medium transition xl:px-4",
          current === link.page ? "lg lg-quiet" : "rounded-[10px] text-foreground/80 hover:bg-white/20 hover:text-foreground",
        )}
      >
        {link.label}
      </a>
    ));

  return (
    <header
      className={cn("sticky top-0 z-50 w-full border-b border-transparent", {
        // Desktop: full-width frosted bar once scrolled. Phone: the bar floats as a glass pill (davinova.com style).
        "lg:border-border lg:bg-background/90 lg:backdrop-blur-lg lg:supports-[backdrop-filter]:bg-background/75": scrolled,
      })}
    >
      <DemoBanner />
      <div className="container pt-2.5 lg:pt-0">
      <nav className="flex h-14 items-center justify-between max-lg:lg-panel max-lg:!rounded-[28px] max-lg:!bg-[#cbc0b5]/75 max-lg:pl-4 max-lg:pr-2 lg:h-[4.5rem]">
        <Logo />
        <div className="hidden items-center gap-3 lg:flex">
          {/* Menu as glass tabs: the page you are on is the raised one. */}
          <div className="lg-track flex items-center gap-1 p-1">{tabs(false)}</div>
          <a className={buttonVariants({ variant: "glass" })} href="/app.html">
            Voir l'app
          </a>
          <a className={buttonVariants({ variant: "glassStrong", className: "!text-sm" })} href="/#liste-attente">
            Liste d'attente
          </a>
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <a className={buttonVariants({ variant: "glass", className: "h-9 !px-3 !text-sm" })} href="/app.html">
            L'app
          </a>
          <a className={buttonVariants({ variant: "glassStrong", className: "h-9 !px-3 !text-sm" })} href="/#liste-attente">
            Liste d'attente
          </a>
        </div>
      </nav>
      </div>
      {/* Phone: the same glass tab bar as on desktop, scrolling sideways (no hamburger menu). */}
      <div className="container pb-2 pt-2 lg:hidden">
        <div className="lg-track flex !bg-[#cbc0b5]/70 backdrop-blur-xl items-center gap-1 overflow-x-auto p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{tabs(true)}</div>
      </div>
    </header>
  );
}

export function DemoBanner() {
  return (
    <div className="bg-board px-4 py-2 text-center font-mono text-[11px] text-board-foreground/80">
      <span className="text-signal">●</span> Service en préparation<span className="hidden sm:inline"> · réservations et paiements pas encore ouverts</span> · réservation en démo
    </div>
  );
}
