import React from "react";
import { ddToDMS } from "../utils/coordConverter";

type EventItem = {
  id: string | number;
  title: string;
  description?: string;
  lat: number;
  lng: number;
  created_at: string | number | Date;
};

type Props = {
  events: EventItem[];
  selected?: EventItem | null;
  onSelect: (ev: EventItem) => void;
  onEdit: (ev: EventItem) => void;
  onDelete: (id: string | number) => void;
  loading?: boolean;
};

function formatDate(iso: string | number | Date) {
  return new Date(iso).toLocaleDateString("en-PH", {
    month: "short", day: "numeric", year: "numeric",
  });
}

export default function EventList({ events, selected, onSelect, onEdit, onDelete, loading }: Props) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-32 text-ink/30 text-sm">
        Loading events…
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-ink/30 gap-2">
        <span className="text-4xl">📍</span>
        <p className="text-sm">No events yet. Pin your first!</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {events.map((ev, i) => (
        <li
          key={ev.id}
          className={`
            group rounded-xl border cursor-pointer transition-all duration-200
            animate-fade-up
            ${
              selected?.id === ev.id
                ? "border-amber-pin bg-amber-pin/10 shadow-sm"
                : "border-ink/10 bg-white/60 hover:border-ink/25 hover:shadow-sm"
            }
          `}
          style={{ animationDelay: `${i * 40}ms` }}
          onClick={() => onSelect(ev)}
        >
          <div className="px-4 py-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-ink truncate">
                  {ev.title}
                </p>
                {ev.description && (
                  <p className="text-xs text-ink/50 mt-0.5 line-clamp-1">
                    {ev.description}
                  </p>
                )}
                <p className="text-xs text-ink/35 mt-1 font-mono">
                  {ddToDMS(ev.lat, "lat")} &nbsp; {ddToDMS(ev.lng, "lng")}
                </p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(ev);
                  }}
                  className="p-1.5 rounded-md hover:bg-ink/10 text-ink/40 hover:text-ink transition-all"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("DELETE ID:", ev.id);
                    onDelete(ev.id);
                  }}
                  className="p-1.5 rounded-md hover:bg-coral/10 text-ink/40 hover:text-coral transition-all"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
            <p className="text-xs text-ink/25 mt-1">
              {formatDate(ev.created_at)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
