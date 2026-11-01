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
          MOVA est un nom de travail et un service en préparation. Aucun service de transport n'est proposé à ce jour :
          les courses, prix, chauffeurs et vérifications affichés dans les démonstrations sont fictifs.
        </p>

        <h2 id="confidentialite" className="scroll-mt-28">Données personnelles</h2>
        <p>
          <strong className="text-foreground">Données collectées :</strong> via la liste d'attente passagers, votre
          e-mail et, si vous les indiquez, votre prénom, commune et type de trajet ; via le formulaire chauffeurs, votre
          prénom, e-mail, et si vous les indiquez, téléphone, commune, disponibilités et la déclaration d'une carte VTC.
          Aucun document n'est collecté.
        </p>
        <p>
          <strong className="text-foreground">Finalité et base légale :</strong> vous informer de l'ouverture du service à
          Besançon et préparer le pilote (recrutement de chauffeurs, choix de la zone), sur la base de votre consentement.
        </p>
        <p>
          <strong className="text-foreground">Responsable du traitement :</strong> <Todo>raison sociale et adresse</Todo>.
          Contact : <Todo>e-mail dédié aux données personnelles</Todo>.
        </p>
        <p>
          <strong className="text-foreground">Conservation :</strong> jusqu'au lancement du pilote et au plus 24 mois
          après votre inscription, puis suppression. <strong className="text-foreground">Hébergement des données :</strong>{" "}
          Supabase, serveurs situés dans l'Union européenne (Irlande).
        </p>
        <p>
          <strong className="text-foreground">Vos droits :</strong> accès, rectification, suppression, retrait du
          consentement et réclamation auprès de la CNIL (cnil.fr). Pour les exercer, écrivez au contact ci-dessus.
        </p>
        <p>
          Les autres parties du site (estimation, vérification par code, prototype d'app) fonctionnent uniquement dans
          votre navigateur et n'envoient aucune donnée.
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
