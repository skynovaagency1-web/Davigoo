import { cn } from "@/lib/utils";

export function Logo({ className, href = "./" }: { className?: string; href?: string }) {
  return (
    <a href={href} className={cn("group flex items-baseline gap-2", className)} aria-label="MOVA, accueil">
      <span className="font-wide text-2xl font-black leading-none tracking-tight">MOVA</span>
      <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Besançon</span>
    </a>
  );
}
