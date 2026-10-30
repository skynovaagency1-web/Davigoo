import { cn } from "@/lib/utils";

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <a href={href} className={cn("flex items-center gap-2.5 font-extrabold tracking-[0.12em]", className)} aria-label="MOVA, accueil">
      <span className="grid size-8 place-items-center rounded-lg bg-primary text-sm text-primary-foreground">M</span>
      <span className="text-lg">MOVA</span>
    </a>
  );
}
