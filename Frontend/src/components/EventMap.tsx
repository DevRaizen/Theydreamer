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

const toNum = (v: number | string) => Number(v);

/* FIX: resize bug */
function ResizeMap() {
  const map = useMap();

  useEffect(() => {
    const t = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => clearTimeout(t);
  }, [map]);

  return null;
}

/* FIX: fly to selected */
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

const pinIcon = (active: boolean) =>
  L.divIcon({
    className: "",
    html: `
      <div style="width:28px;height:36px;display:flex;flex-direction:column;align-items:center;">
        <div style="
          width:24px;height:24px;border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          background:${active ? "#e8a020" : "#0f0e0d"};
          border:2px solid ${active ? "#f5c84a" : "#2a2825"};
        "></div>
        <div style="width:2px;height:12px;background:${active ? "#e8a020" : "#0f0e0d"};"></div>
      </div>
    `,
    iconSize: [28, 38],
    iconAnchor: [14, 38],
    popupAnchor: [0, -40],
  });

export default function EventMap({
  events,
  selected,
  onSelect,
}: EventMapProps) {
  const defaultCenter: [number, number] = [14.5995, 120.9842];

  return (
    <div className="absolute inset-0">
      <MapContainer
        center={defaultCenter}
        zoom={6}
        className="w-full h-full"
        zoomControl={true}
      >
        {/* FIX */}
        <ResizeMap />

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {events.map((ev) => {
          const lat = toNum(ev.lat);
          const lng = toNum(ev.lng);

          if (isNaN(lat) || isNaN(lng)) return null;

          return (
            <Marker
              key={ev.id}
              position={[lat, lng]}
              icon={pinIcon(selected?.id === ev.id)}
              eventHandlers={{ click: () => onSelect(ev) }}
            >
              <Popup>
                <b>{ev.title}</b>
                <p>{ev.description}</p>
                <small>
                  {ddToDMS(lat, "lat")} <br />
                  {ddToDMS(lng, "lng")}
                </small>
              </Popup>
            </Marker>
          );
        })}

        {selected && <FlyTo event={selected} />}
      </MapContainer>
    </div>
  );
}
