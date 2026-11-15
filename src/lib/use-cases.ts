import { Clock3, GraduationCap, Luggage, Moon, Stethoscope, TrainFront } from "lucide-react";

// Ride types the pilot wants to test (Trajets page).
export const useCases = [
  { icon: TrainFront, title: "Gares Viotte et Besançon TGV", description: "Rejoindre Auxon ou Viotte sans chercher de place ni rater le train.", footnote: "Centre → TGV · ≈ 12 km" },
  { icon: Moon, title: "Soirées", description: "Rentrer de Battant ou du centre quand les bus se font rares.", footnote: "Horaires à définir" },
  { icon: Stethoscope, title: "CHU Minjoz", description: "Rendez-vous médicaux et visites, avec un trajet planifié à l'avance.", footnote: "Accessibilité à préciser" },
  { icon: GraduationCap, title: "La Bouloie, Témis, Micropolis", description: "Des trajets courts et réguliers entre campus, zones d'activité et salons.", footnote: "Demande à mesurer" },
  { icon: Luggage, title: "Bagages et groupes", description: "Un van jusqu'à 7 places pour les familles et les valises.", footnote: "Catégorie à confirmer" },
  { icon: Clock3, title: "Immédiat ou planifié", description: "Réserver maintenant ou la veille, avec un prix affiché avant de confirmer.", footnote: "Mode à trancher" },
];
