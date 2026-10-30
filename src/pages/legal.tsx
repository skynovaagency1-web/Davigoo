import { Header } from "@/components/ui/header-1";
import FooterSection from "@/components/ui/footer";

const Todo = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded bg-primary/15 px-1.5 py-0.5 font-semibold text-primary">{children}</span>
);

export default function Legal() {
  return (
    <>
      <Header />
      <main className="container max-w-3xl py-14 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-bold [&_p]:mt-3 [&_p]:text-muted-foreground [&_li]:text-muted-foreground">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Mentions légales</h1>
        <p>
          Page provisoire. Les champs surlignés doivent être complétés avant toute mise en ligne publique, et le contenu
          validé par un professionnel.
        </p>

        <h2>Éditeur du site</h2>
        <p>
          Raison sociale : <Todo>à compléter</Todo>. Forme juridique et capital : <Todo>à compléter</Todo>. Siège :{" "}
          <Todo>adresse</Todo>. SIREN / RCS : <Todo>à compléter</Todo>. Directeur de la publication : <Todo>nom</Todo>.
          Contact : <Todo>e-mail et téléphone</Todo>.
        </p>

        <h2>Hébergement</h2>
        <p>
          Hébergeur : <Todo>nom, adresse et téléphone de l'hébergeur</Todo>.
        </p>

        <h2>Statut du service</h2>
        <p>
          MOVA est un nom de travail et un prototype. Aucun service de transport n'est proposé à ce jour : aucune course,
          aucun paiement, aucune vérification et aucun chauffeur affichés sur ce site ne sont réels.
        </p>

        <h2>Données personnelles</h2>
        <p>
          Ce prototype ne transmet aucune donnée à un serveur : les formulaires fonctionnent uniquement dans votre
          navigateur. Une politique de confidentialité conforme au RGPD (responsable de traitement, finalités, durées de
          conservation, droits, géolocalisation) sera publiée avant le pilote.
        </p>

        <h2>Propriété intellectuelle</h2>
        <p>
          La disponibilité du nom et de la marque MOVA n'a pas encore été vérifiée (INPI, EUIPO, noms de domaine).
        </p>
      </main>
      <FooterSection />
    </>
  );
}
