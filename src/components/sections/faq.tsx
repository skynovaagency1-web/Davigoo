import { Accordion } from "@/components/ui/accordion";

const items = [
  {
    id: "real",
    title: "Puis-je réserver une vraie course aujourd'hui ?",
    content: <p>Non. MOVA est au stade de prototype : aucune réservation, aucun chauffeur, aucun paiement n'est réel. Ce site sert à présenter le concept et à mesurer l'intérêt local.</p>,
  },
  {
    id: "zone",
    title: "Quelle zone sera couverte ?",
    content: <p>Le pilote démarrera sur une zone restreinte de Besançon (trajets urbains, gares, soirées…). La zone et les horaires seront fixés après des entretiens avec passagers et chauffeurs.</p>,
  },
  {
    id: "price",
    title: "Comment les prix seront-ils calculés ?",
    content: <p>Prix fixe ou estimation, commission et frais d'annulation sont en cours de définition et feront l'objet d'une validation juridique et économique. Les montants affichés ici sont fictifs.</p>,
  },
  {
    id: "payment",
    title: "Comment se fera le paiement ?",
    content: <p>Via un prestataire de paiement agréé, adapté aux places de marché (vérification des bénéficiaires, reversement aux chauffeurs, remboursements). MOVA n'encaissera pas les fonds en propre sans avis spécialisé.</p>,
  },
  {
    id: "data",
    title: "Que faites-vous de mes données ?",
    content: <p>Ce prototype n'envoie aucune donnée à un serveur. Avant le pilote, une politique de confidentialité conforme au RGPD et aux recommandations de la CNIL (géolocalisation, applications mobiles) sera publiée.</p>,
  },
  {
    id: "driver",
    title: "Je suis chauffeur VTC, comment participer ?",
    content: <p>Utilisez le formulaire de la section Chauffeurs pour voir le parcours. La collecte réelle des documents se fera plus tard via un espace sécurisé, jamais par e-mail.</p>,
  },
];

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-24 py-20">
      <div className="container max-w-3xl">
        <p className="text-center text-xs font-bold uppercase tracking-[0.14em] text-primary">FAQ</p>
        <h2 className="mt-3 text-center text-3xl font-bold tracking-tight sm:text-4xl">Questions fréquentes</h2>
        <Accordion items={items} defaultOpen={["real"]} className="mt-10" />
      </div>
    </section>
  );
}
