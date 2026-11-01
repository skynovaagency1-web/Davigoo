import type { Place } from "./places";

// French national address base (BAN) through the Géoplateforme: free, no key, France only.
const API = "https://data.geopf.fr/geocodage";
const BESANCON = { lat: 47.2378, lng: 6.0241 };

type Feature = { geometry: { coordinates: [number, number] }; properties: { id?: string; label: string; name: string; city: string; postcode: string; type: string } };

function toPlace(f: Feature): Place {
  const p = f.properties;
  const [lng, lat] = f.geometry.coordinates;
  const label = p.type === "municipality" ? `${p.city} (${p.postcode})` : `${p.name}, ${p.city}`;
  return { id: p.id ?? `${lat},${lng}`, label, short: p.name, lat, lng };
}

export async function searchAddress(q: string, near = BESANCON, signal?: AbortSignal): Promise<Place[]> {
  if (q.trim().length < 3) return [];
  const url = `${API}/search?q=${encodeURIComponent(q.trim())}&lat=${near.lat}&lon=${near.lng}&limit=6&autocomplete=1`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error("search_failed");
  const json = (await res.json()) as { features: Feature[] };
  return json.features.map(toPlace);
}

export async function reverseGeocode(lat: number, lng: number): Promise<Place | null> {
  const res = await fetch(`${API}/reverse?lat=${lat}&lon=${lng}&limit=1`);
  if (!res.ok) return null;
  const json = (await res.json()) as { features: Feature[] };
  const f = json.features[0];
  return f ? { ...toPlace(f), lat, lng } : null;
}

export const DEFAULT_REGION = { latitude: BESANCON.lat, longitude: BESANCON.lng, latitudeDelta: 0.09, longitudeDelta: 0.09 };
