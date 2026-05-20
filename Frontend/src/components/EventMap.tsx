import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { ddToDMS } from "../utils/coordConverter";

interface EventMapEvent {
  id: string | number;
  title: string;
  lat: number | string;
  lng: number | string;
  description?: string;
}

interface EventMapProps {
  events: EventMapEvent[];
  selected?: EventMapEvent | null;
  onSelect: (event: EventMapEvent) => void;
}

// Convert safely to number (🔥 FIX)
const toNum = (v: number | string) => Number(v);

// Custom marker
const pinIcon = (active: boolean) =>
  L.divIcon({
    className: "",
    html: `
      <div style="
        width:28px; height:36px;
        display:flex; flex-direction:column; align-items:center;
      ">
        <div style="
          width:24px; height:24px; border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          background:${active ? "#e8a020" : "#0f0e0d"};
          border:2px solid ${active ? "#f5c84a" : "#2a2825"};
          box-shadow:0 2px 8px rgba(0,0,0,0.35);
        "></div>
        <div style="
          width:2px; height:12px;
          background:${active ? "#e8a020" : "#0f0e0d"};
        "></div>
      </div>`,
    iconSize: [28, 38],
    iconAnchor: [14, 38],
    popupAnchor: [0, -40],
  });

// Fly to selected event
function FlyTo({ event }: { event: EventMapEvent }) {
  const map = useMap();

  useEffect(() => {
    if (event) {
      map.flyTo([toNum(event.lat), toNum(event.lng)], 14, {
        duration: 1,
      });
    }
  }, [event, map]);

  return null;
}

export default function EventMap({
  events,
  selected,
  onSelect,
}: EventMapProps) {
  const defaultCenter: [number, number] = [14.5995, 120.9842]; // Manila

  return (
    <div className="w-full h-full">
      <MapContainer
        center={defaultCenter}
        zoom={6}
        className="w-full h-screen" // 🔥 FIX FULL SCREEN MAP
        style={{ height: "100vh", width: "100%" }} // extra safety
        zoomControl={true}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {events.map((ev) => {
          const lat = toNum(ev.lat);
          const lng = toNum(ev.lng);

          // 🔥 prevent crash if invalid data
          if (isNaN(lat) || isNaN(lng)) return null;

          return (
            <Marker
              key={ev.id}
              position={[lat, lng]}
              icon={pinIcon(selected?.id === ev.id)}
              eventHandlers={{ click: () => onSelect(ev) }}
            >
              <Popup>
                <div style={{ minWidth: 180 }}>
                  <p style={{ fontWeight: 700, fontSize: 14 }}>{ev.title}</p>

                  {ev.description && (
                    <p style={{ fontSize: 12, opacity: 0.7 }}>
                      {ev.description}
                    </p>
                  )}

                  <p style={{ fontSize: 11, opacity: 0.6 }}>
                    {ddToDMS(lat, "lat")}
                    <br />
                    {ddToDMS(lng, "lng")}
                  </p>

                  {/* 🔥 FIXED toFixed error */}
                  <p style={{ fontSize: 11, opacity: 0.6 }}>
                    {lat.toFixed(6)}, {lng.toFixed(6)}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {selected && <FlyTo event={selected} />}
      </MapContainer>
    </div>
  );
}
