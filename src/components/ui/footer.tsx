// Adapted from 21st.dev "Footer" by meschacirung (Tailark): plain anchors instead of next/link, MOVA content.
import { Mail, MapPin } from "lucide-react";
import { Logo } from "@/components/ui/logo";

const links = [
  { title: "Comment ça marche", href: "./#fonctionnement" },
  { title: "Trajets", href: "./#trajets" },
  { title: "Sécurité", href: "./#securite" },
  { title: "Devenir chauffeur", href: "./#chauffeurs" },
  { title: "FAQ", href: "./#faq" },
  { title: "Prototype d'app", href: "./app.html" },
  { title: "Mentions légales", href: "./mentions-legales.html" },
];

export default function FooterSection() {
  return (
    <footer className="border-t py-16">
      <div className="mx-auto max-w-5xl px-6">
        <Logo className="mx-auto w-fit" />

        <div className="my-8 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm">
          {links.map((link) => (
            <a key={link.title} href={link.href} className="block text-muted-foreground duration-150 hover:text-primary">
              {link.title}
            </a>
          ))}
        </div>
        <div className="my-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <MapPin className="size-4" /> Besançon, Doubs
          </span>
          <span className="inline-flex items-center gap-2">
            <Mail className="size-4" /> Contact à définir
          </span>
        </div>
        <p className="mx-auto max-w-2xl text-center text-xs text-muted-foreground">
          MOVA est un nom de travail, non vérifié juridiquement. Ce site est un prototype : aucune course, aucun paiement,
          aucun chauffeur et aucune vérification ne sont réels.
        </p>
        <span className="mt-4 block text-center text-sm text-muted-foreground">© {new Date().getFullYear()} MOVA (projet)</span>
      </div>
    </footer>
  );
}
