import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function AppTeaser() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/20 via-card to-card p-8 sm:p-12">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Prototype interactif</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Côté passager, côté chauffeur</h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Commandez une course fictive, puis basculez en mode chauffeur pour accepter une demande et faire avancer le trajet.
            </p>
            <a href="/app.html" className={buttonVariants({ size: "lg", className: "mt-6" })}>
              Ouvrir le prototype <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
