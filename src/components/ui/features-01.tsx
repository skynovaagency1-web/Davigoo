// Adapted from 21st.dev "Features Grid" (shadcnui-blocks/features-01): content passed in as props.
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type Feature = { icon: LucideIcon; title: string; description: string; footnote?: string };

type FeaturesProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  features: Feature[];
  className?: string;
};

const Features = ({ id, eyebrow, title, subtitle, features, className }: FeaturesProps) => {
  return (
    <section id={id} className={cn("scroll-mt-24 px-6 py-20", className)}>
      {eyebrow && (
        <p className="text-center text-xs font-bold uppercase tracking-[0.14em] text-primary">{eyebrow}</p>
      )}
      <h2 className="mx-auto mt-3 max-w-3xl text-center text-3xl font-bold tracking-tighter sm:text-4xl">{title}</h2>
      {subtitle && (
        <p className="mx-auto mt-3 max-w-2xl text-pretty text-center text-lg tracking-[-0.01em] text-muted-foreground">
          {subtitle}
        </p>
      )}
      <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div className="flex flex-col rounded-xl border bg-card p-6" key={feature.title}>
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
              <feature.icon className="size-5" />
            </div>
            <span className="text-lg font-semibold">{feature.title}</span>
            <p className="mt-1 text-[15px] text-foreground/75">{feature.description}</p>
            {feature.footnote && <p className="mt-auto pt-4 text-sm font-semibold text-foreground">{feature.footnote}</p>}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
