// Adapted from 21st.dev "Features Grid" (shadcnui-blocks/features-01): props-driven content,
// laid out as timetable rows instead of cards.
import type { LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

export type Feature = { icon: LucideIcon; title: string; description: string; footnote?: string };

type FeaturesProps = {
  id?: string;
  tag: string;
  title: string;
  subtitle?: string;
  features: Feature[];
  className?: string;
};

const Features = ({ id, tag, title, subtitle, features, className }: FeaturesProps) => {
  return (
    <section id={id} className={cn("scroll-mt-24 py-20", className)}>
      <div className="container">
        <SectionHeading tag={tag} title={title}>
          {subtitle}
        </SectionHeading>
        <ul className="mt-10 grid md:ml-[12rem] md:grid-cols-2 md:gap-x-10">
          {features.map((feature) => (
            <li key={feature.title} className="grid grid-cols-[2.25rem_1fr] gap-x-3 border-b py-5">
              <feature.icon className="mt-0.5 size-5 text-primary" />
              <div className="min-w-0">
                <p className="font-bold">{feature.title}</p>
                <p className="mt-1 text-[15px] text-muted-foreground">{feature.description}</p>
                {feature.footnote && <p className="mt-2 font-mono text-[11px] text-foreground/70">{feature.footnote}</p>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Features;
