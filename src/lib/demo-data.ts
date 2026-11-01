// Fictitious demo data. Nothing here comes from a real routing, pricing or dispatch service.

export type Place = { id: string; label: string; short: string; lat: number; lng: number };

export const PLACES: Place[] = [
  { id: "viotte", label: "Gare Besançon-Viotte", short: "Gare Viotte", lat: 47.247, lng: 6.0222 },
  { id: "centre", label: "Centre-ville (Place du 8 Septembre)", short: "Centre-ville", lat: 47.2378, lng: 6.0241 },
  { id: "battant", label: "Quartier Battant", short: "Battant", lat: 47.241, lng: 6.018 },
  { id: "citadelle", label: "Citadelle de Besançon", short: "Citadelle", lat: 47.231, lng: 6.032 },
  { id: "tgv", label: "Gare Besançon Franche-Comté TGV (Auxon)", short: "Gare TGV", lat: 47.3075, lng: 5.9535 },
  { id: "chu", label: "CHU Jean Minjoz", short: "CHU Minjoz", lat: 47.2236, lng: 5.9466 },
  { id: "campus", label: "Campus de la Bouloie / Témis", short: "Campus Bouloie", lat: 47.249, lng: 5.993 },
  { id: "planoise", label: "Planoise", short: "Planoise", lat: 47.223, lng: 5.96 },
  { id: "micropolis", label: "Micropolis", short: "Micropolis", lat: 47.2206, lng: 5.9814 },
  { id: "chalezeule", label: "Chalezeule / Marnières", short: "Chalezeule", lat: 47.262, lng: 6.07 },
];

export type Category = { id: "standard" | "confort" | "van"; label: string; hint: string; seats: number; factor: number };

export const CATEGORIES: Category[] = [
  { id: "standard", label: "Standard", hint: "Berline, 4 places", seats: 4, factor: 1 },
  { id: "confort", label: "Confort", hint: "Berline premium", seats: 4, factor: 1.3 },
  { id: "van", label: "Van", hint: "Jusqu'à 7 places", seats: 7, factor: 1.55 },
];

function haversineKm(a: Place, b: Place) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export type Estimate = { km: number; minutes: number; price: number; night: boolean };

/** Fictitious estimate: straight-line distance × detour factor, demo tariff. Not a real price. */
export function estimateRide(fromId: string, toId: string, categoryId: Category["id"], time?: string): Estimate | null {
  const from = PLACES.find((p) => p.id === fromId);
  const to = PLACES.find((p) => p.id === toId);
  const cat = CATEGORIES.find((c) => c.id === categoryId);
  if (!from || !to || !cat || from.id === to.id) return null;
  const km = haversineKm(from, to) * 1.35;
  const minutes = Math.round((km / 24) * 60 + 3);
  const hour = time ? Number(time.split(":")[0]) : new Date().getHours();
  const night = hour >= 21 || hour < 6;
  const raw = (4 + km * 1.9) * cat.factor * (night ? 1.2 : 1);
  const price = Math.max(8, Math.round(raw * 2) / 2);
  return { km: Math.round(km * 10) / 10, minutes, price, night };
}

export const formatEuro = (n: number) =>
  n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", minimumFractionDigits: n % 1 ? 2 : 0 });
