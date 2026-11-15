// Adapted from 21st.dev "Header 1" by efferd: sticky header with scroll blur and animated mobile menu.
import React from "react";
import { createPortal } from "react-dom";
import { Button, buttonVariants } from "@/components/ui/button";
import { MenuToggleIcon } from "@/components/ui/menu-toggle-icon";
import { Logo } from "@/components/ui/logo";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

// Menu grouped in dropdowns, after the davinova.com header: a pill trigger, then a dark glass panel
// that springs open below it with a list of links (title + one line).
type MenuLink = { label: string; text: string; href: string; page?: string };
const groups: { label: string; pages: string[]; links: MenuLink[] }[] = [
  {
    label: "Le service",
    pages: ["fonctionnement", "trajets", "securite"],
    links: [
      { label: "Comment ça marche", text: "Trois étapes, prix affiché avant de partir", href: "/comment-ca-marche.html", page: "fonctionnement" },
      { label: "Trajets", text: "Gares, soirées, CHU, campus", href: "/trajets.html", page: "trajets" },
      { label: "Sécurité", text: "Chauffeurs contrôlés, passagers vérifiés", href: "/securite.html", page: "securite" },
      { label: "Estimer un trajet", text: "Un prix d'exemple en deux clics", href: "/comment-ca-marche.html#devis" },
    ],
  },
  {
    label: "Chauffeurs",
    pages: ["chauffeurs"],
    links: [
      { label: "Conduire avec DaviGoo", text: "Une plateforme de votre ville", href: "/chauffeurs.html", page: "chauffeurs" },
      { label: "Laisser mes coordonnées", text: "Nous vous rappelons avant le pilote", href: "/chauffeurs.html#chauffeurs" },
    ],
  },
  {
    label: "Aide",
    pages: ["faq"],
    links: [
      { label: "FAQ", text: "Prix, zone, paiement, données", href: "/faq.html", page: "faq" },
      { label: "Confidentialité", text: "Vos données et vos droits", href: "/confidentialite.html" },
      { label: "Mentions légales", text: "Qui édite le site", href: "/mentions-legales.html" },
    ],
  },
];

export type SitePage = "fonctionnement" | "trajets" | "securite" | "chauffeurs" | "faq" | "home";

export function Header({ current = "home" }: { current?: SitePage }) {
  const [open, setOpen] = React.useState(false);
  const [menuTop, setMenuTop] = React.useState(0);
  const headerRef = React.useRef<HTMLElement>(null);
  const scrolled = useScroll(10);

  React.useLayoutEffect(() => {
    if (open && headerRef.current) setMenuTop(headerRef.current.getBoundingClientRect().bottom);
  }, [open]);

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
    <header
      ref={headerRef}
      className={cn("sticky top-0 z-50 w-full border-b border-transparent", {
        "border-border bg-background/90 backdrop-blur-lg supports-[backdrop-filter]:bg-background/75": scrolled || open,
      })}
    >
      <DemoBanner />
      <nav className="container flex h-[4.5rem] items-center justify-between">
        <Logo />
        <div className="hidden items-center gap-3 lg:flex">
          <DropdownMenu current={current} />
          <a className={buttonVariants({ variant: "glass" })} href="/app.html">
            Voir l'app
          </a>
          <a className={buttonVariants({ variant: "glassStrong", className: "!text-sm" })} href="/#liste-attente">
            Liste d'attente
          </a>
        </div>
        <Button
          size="icon"
          variant="glass"
          onClick={() => setOpen(!open)}
          className="lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Ouvrir le menu"
        >
          <MenuToggleIcon open={open} className="size-5" duration={300} />
        </Button>
      </nav>
      <MobileMenu open={open} top={menuTop} className="flex flex-col justify-between gap-2">
        <div className="grid min-h-0 gap-5 overflow-y-auto">
          {groups.map((g) => (
            <div key={g.label}>
              <p className="px-3 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground/60">{g.label}</p>
              <div className="mt-1.5 grid gap-1">
                {g.links.map((link) => (
                  <a
                    key={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={link.page && current === link.page ? "page" : undefined}
                    className={cn("block px-3 py-2.5", link.page && current === link.page ? "lg lg-quiet" : "rounded-[12px] hover:bg-white/20")}
                    href={link.href}
                  >
                    <span className="block text-base font-semibold">{link.label}</span>
                    <span className={cn("block text-xs", link.page && current === link.page ? "text-white/90" : "text-muted-foreground")}>{link.text}</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <a className={buttonVariants({ variant: "glass", size: "lg", className: "w-full" })} href="/app.html">
            Voir l'app (démo)
          </a>
          <a onClick={() => setOpen(false)} className={buttonVariants({ variant: "glassStrong", size: "lg", className: "w-full" })} href="/#liste-attente">
            Rejoindre la liste d'attente
          </a>
        </div>
      </MobileMenu>
    </header>
    </>
  );
}

export function DemoBanner() {
  return (
    <div className="bg-board px-4 py-2 text-center font-mono text-[11px] text-board-foreground/80">
      <span className="text-signal">●</span> Service en préparation<span className="hidden sm:inline"> · réservations et paiements pas encore ouverts</span> · réservation en démo
    </div>
  );
}

type MobileMenuProps = React.ComponentProps<"div"> & { open: boolean; top: number };

function MobileMenu({ open, top, children, className, ...props }: MobileMenuProps) {
  if (!open || typeof window === "undefined") return null;

  return createPortal(
    <div
      id="mobile-menu"
      className={cn(
        "bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/80",
        "fixed bottom-0 left-0 right-0 z-40 flex flex-col overflow-hidden border-y lg:hidden",
      )}
      style={{ top }}
    >
      <div
        data-slot={open ? "open" : "closed"}
        className={cn("size-full p-4 ease-out data-[slot=open]:animate-in data-[slot=open]:zoom-in-95", className)}
        {...props}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

/** Desktop menu: pill triggers that open a dark glass panel on hover, click or keyboard (davinova.com style). */
function DropdownMenu({ current }: { current: SitePage }) {
  const [openIdx, setOpenIdx] = React.useState<number | null>(null);
  const closeTimer = React.useRef<number>();
  const navRef = React.useRef<HTMLDivElement>(null);

  const show = (i: number) => {
    window.clearTimeout(closeTimer.current);
    setOpenIdx(i);
  };
  const hide = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenIdx(null), 140);
  };

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenIdx(null);
    const onDown = (e: PointerEvent) => !navRef.current?.contains(e.target as Node) && setOpenIdx(null);
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return (
    <div ref={navRef} className="lg-track flex items-center gap-1 p-1" onMouseLeave={hide}>
      {groups.map((g, i) => {
        const open = openIdx === i;
        const here = g.pages.includes(current);
        return (
          <div key={g.label} className="relative" onMouseEnter={() => show(i)} onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && hide()}>
            <button
              type="button"
              aria-expanded={open}
              aria-haspopup="true"
              onClick={() => setOpenIdx(open ? null : i)}
              onKeyDown={(e) => e.key === "ArrowDown" && (e.preventDefault(), show(i))}
              className={cn(
                "inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
                open || here ? "lg lg-quiet" : "rounded-[10px] text-foreground/80 hover:bg-white/20 hover:text-foreground",
              )}
            >
              {g.label}
              <ChevronDown className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")} />
            </button>
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.95, transition: { duration: 0.12 } }}
                  transition={{ type: "spring", stiffness: 420, damping: 30 }}
                  style={{ transformOrigin: "top left" }}
                  className="absolute left-0 top-full z-50 pt-3"
                >
                  <div className="menu-panel w-max min-w-[260px] p-2.5">
                    {g.links.map((link) => {
                      const active = link.page === current;
                      return (
                        <a
                          key={link.href}
                          href={link.href}
                          aria-current={active ? "page" : undefined}
                          onClick={() => setOpenIdx(null)}
                          className={cn(
                            "block rounded-[12px] px-3 py-2.5 transition-all duration-200 hover:bg-white/10 hover:pl-4 focus-visible:bg-white/10 focus-visible:outline-none",
                            active && "bg-white/[0.12]",
                          )}
                        >
                          <span className="block text-[15px] font-semibold text-[#f6efe7]">{link.label}</span>
                          <span className="mt-0.5 block text-xs text-[#c9bcae]">{link.text}</span>
                        </a>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
