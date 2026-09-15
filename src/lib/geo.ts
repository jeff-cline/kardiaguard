import "server-only";
// Offline US ZIP geocoding via the `zipcodes` package — no API key.
import zipcodes from "zipcodes";

export type Geo = { lat: number; lng: number; city: string; state: string };

export function geocodeZip(zip: string): Geo | null {
  const z = String(zip || "").trim().slice(0, 5);
  if (!/^\d{5}$/.test(z)) return null;
  const r = zipcodes.lookup(z) as { latitude?: number; longitude?: number; city?: string; state?: string } | undefined;
  if (!r || typeof r.latitude !== "number" || typeof r.longitude !== "number") return null;
  return { lat: r.latitude, lng: r.longitude, city: r.city || "", state: r.state || "" };
}

// Miles between two lat/lng points (haversine).
export function milesBetween(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 3958.8;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}
