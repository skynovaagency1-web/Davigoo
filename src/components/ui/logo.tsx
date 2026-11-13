import { Wordmark } from "@/components/ui/wordmark";
import { cn } from "@/lib/utils";

export function Logo({ href = "./", className }: { href?: string; className?: string }) {
  return (
    <a href={href} className={cn("group flex items-center", className)} aria-label="DaviGoo, accueil">
      <Wordmark className="w-[8.5rem] text-foreground" shine title="DaviGoo" />
    </a>
  );
}
