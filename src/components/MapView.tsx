"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

export type MapLoc = {
  id: string;
  name: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
  miles: number | null;
};

const pin = (color: string) =>
  L.divIcon({
    className: "kg-pin",
    html: `<div style="width:26px;height:26px;transform:translate(-50%,-100%)">
      <svg viewBox="0 0 24 24" width="26" height="26"><path fill="${color}" stroke="#fff" stroke-width="1.5" d="M12 2C7.6 2 4 5.6 4 10c0 5.4 7 11.5 7.3 11.8.4.3.9.3 1.3 0C13 21.5 20 15.4 20 10c0-4.4-3.6-8-8-8z"/><circle cx="12" cy="10" r="3" fill="#fff"/></svg>
    </div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 26],
  });

const locPin = pin("#6D28D9");
const homePin = pin("#e0396f");

function Recenter({ lat, lng, zoom }: { lat: number; lng: number; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], zoom);
  }, [lat, lng, zoom, map]);
  return null;
}

export default function MapView({ origin, locations }: { origin: { lat: number; lng: number } | null; locations: MapLoc[] }) {
  const center = origin || (locations[0] ? { lat: locations[0].lat, lng: locations[0].lng } : { lat: 39.5, lng: -98.35 });
  const zoom = origin ? 9 : locations.length ? 10 : 4;
  return (
    <div style={{ height: 460, borderRadius: 16, overflow: "hidden", border: "1px solid var(--line)", boxShadow: "var(--shadow)" }}>
      <MapContainer center={[center.lat, center.lng]} zoom={zoom} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
        <Recenter lat={center.lat} lng={center.lng} zoom={zoom} />
        <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {origin && (
          <Marker position={[origin.lat, origin.lng]} icon={homePin}>
            <Popup>You (approximate)</Popup>
          </Marker>
        )}
        {locations.map((l) => (
          <Marker key={l.id} position={[l.lat, l.lng]} icon={locPin}>
            <Popup>
              <b>{l.name}</b>
              <br />
              {l.city}
              {l.city && l.state ? ", " : ""}
              {l.state} {l.zip}
              {l.miles != null && <><br />{l.miles} mi away</>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
