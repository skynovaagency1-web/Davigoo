import { cn } from "@/lib/utils";

/** Section title with a mono index tag, e.g. "B2 · Trajets". */
export function SectionHeading({
  tag,
  title,
  children,
  className,
  invert,
}: {
  tag: string;
  title: string;
  children?: React.ReactNode;
  className?: string;
  invert?: boolean;
}) {
  return (
    <div className={cn("grid gap-4 border-t pt-5 md:grid-cols-[12rem_1fr]", invert ? "border-board-foreground/20" : "border-foreground/80", className)}>
      <p className={cn("font-mono text-xs", invert ? "text-signal" : "text-muted-foreground")}>{tag}</p>
      <div className="max-w-2xl">
        <h2 className="text-3xl font-extrabold leading-[1.05] tracking-tight sm:text-[2.6rem]">{title}</h2>
        {children && <div className={cn("mt-3 text-lg", invert ? "text-board-foreground/70" : "text-muted-foreground")}>{children}</div>}
      </div>
    </div>
  );
}
