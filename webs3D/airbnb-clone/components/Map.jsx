"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";

const priceIcon = (price) =>
  L.divIcon({
    className: "",
    html: `<div style="background:white;border:1px solid #222;border-radius:9999px;padding:4px 10px;font-weight:700;font-size:13px;box-shadow:0 2px 6px rgba(0,0,0,0.2)">$${price}</div>`,
    iconSize: [50, 28],
    iconAnchor: [25, 14]
  });

export default function Map({ listings }) {
  const center = listings.length
    ? [listings[0].lat, listings[0].lng]
    : [23.6345, -102.5528];

  return (
    <MapContainer center={center} zoom={5} scrollWheelZoom className="h-full w-full">
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {listings.map((l) => (
        <Marker key={l.id} position={[l.lat, l.lng]} icon={priceIcon(l.price)}>
          <Popup>
            <Link href={`/rooms/${l.id}`} className="block w-44">
              <img src={l.images[0]} alt={l.title} className="w-full h-24 object-cover rounded-md mb-2" />
              <div className="text-xs font-semibold">{l.location}</div>
              <div className="text-xs text-neutral-500 line-clamp-1">{l.title}</div>
              <div className="text-xs mt-1">${l.price} noche</div>
            </Link>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
