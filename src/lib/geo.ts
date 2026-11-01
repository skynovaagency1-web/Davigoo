import type { Place } from "@/lib/demo-data";

// French national address base (BAN) through the Géoplateforme: free, no key, France only.
const API = "https://data.geopf.fr/geocodage";
const BESANCON = { lat: 47.2378, lng: 6.0241 };

type Feature = { geometry: { coordinates: [number, number] }; properties: { id?: string; label: string; name: string; city: string; postcode: string; type: string } };

export async function searchAddress(q: string, signal?: AbortSignal): Promise<Place[]> {
  if (q.trim().length < 3) return [];
  const res = await fetch(`${API}/search?q=${encodeURIComponent(q.trim())}&lat=${BESANCON.lat}&lon=${BESANCON.lng}&limit=6&autocomplete=1`, { signal });
  if (!res.ok) throw new Error("search_failed");
  const json = (await res.json()) as { features: Feature[] };
  return json.features.map((f) => {
    const p = f.properties;
    const [lng, lat] = f.geometry.coordinates;
    return { id: p.id ?? `${lat},${lng}`, label: p.type === "municipality" ? `${p.city} (${p.postcode})` : `${p.name}, ${p.city}`, short: p.name, lat, lng };
  });
}
