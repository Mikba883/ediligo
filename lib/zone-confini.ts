// Confini ufficiali delle zone OMI di Milano: trova la zona che contiene un punto.
// Usato solo lato server (API /api/geocode), così il file dei confini non finisce nel browser.
import confini from "@/data/zone-milano-confini.json";

type Ring = number[][];
const data = confini as { zones: { id: string; polys: Ring[][] }[] };

function inRing(lng: number, lat: number, ring: Ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

export function omiZoneAt(lat: number, lng: number): string | null {
  for (const z of data.zones) {
    for (const [outer, ...holes] of z.polys) {
      if (inRing(lng, lat, outer) && !holes.some((h) => inRing(lng, lat, h))) return z.id;
    }
  }
  return null;
}
