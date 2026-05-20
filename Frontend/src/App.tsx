import React, { useState, useCallback } from "react";
import EventForm from "./components/EventForm";
import EventList from "./components/EventList";
import EventMap from "./components/EventMap";
import Toast from "./components/Toast";
import { useEvents } from "./hooks/useEvents";

export default function App() {
  const {
    events = [],
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
  } = useEvents();

  const [selected, setSelected] = useState<any | null>(null);
  const [editing, setEditing] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [panel, setPanel] = useState<"list" | "form">("list");

  const showToast = useCallback(
    (message: any, type: "success" | "error" = "success") => {
      setToast({ message, type });
    },
    [],
  );

  async function handleCreate(payload: any) {
    setSubmitting(true);
    try {
      const ev = await createEvent(payload);
      setSelected(ev);
      showToast("Event pinned!");
      setPanel("list");
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : String(e), "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate(payload: any) {
    if (!editing) {
      showToast("No event selected for update", "error");
      return;
    }

    setSubmitting(true);
    try {
      const ev = await updateEvent(editing.id, payload);
      setSelected(ev);
      setEditing(null);
      showToast("Event updated!");
      setPanel("list");
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : String(e), "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: any) {
    if (!confirm("Delete this event?")) return;

    try {
      await deleteEvent(id);
      if (selected?.id === id) setSelected(null);
      showToast("Event removed.");
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : String(e), "error");
    }
  }

  function startEdit(ev: any) {
    setEditing(ev);
    setPanel("form");
  }

  function startCreate() {
    setEditing(null);
    setPanel("form");
  }

  function cancelForm() {
    setEditing(null);
    setPanel("list");
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-parchment">
      {/* Sidebar */}
      <aside className="w-[380px] flex flex-col shrink-0 border-r border-ink/10 bg-parchment z-10 shadow-xl shadow-ink/5">
        <div className="px-6 pt-7 pb-5 border-b border-ink/10">
          <h1 className="font-display text-3xl text-ink leading-tight">
            Pin the <br />
            <span className="text-amber-pin">World</span>
          </h1>
          <p className="text-xs text-ink/40 mt-1 font-body">
            Your personal event map
          </p>
        </div>

        <div className="flex border-b border-ink/10">
          <button
            onClick={() => setPanel("list")}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-widest ${
              panel === "list"
                ? "text-ink border-b-2 border-ink"
                : "text-ink/35"
            }`}
          >
            Events ({events?.length ?? 0})
          </button>

          <button
            onClick={startCreate}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-widest ${
              panel === "form"
                ? "text-amber-pin border-b-2 border-amber-pin"
                : "text-ink/35"
            }`}
          >
            + New Event
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {error && (
            <div className="mb-3 px-3 py-2 bg-red-100 text-red-600 text-xs rounded">
              {error}
            </div>
          )}

          {panel === "list" && (
            <EventList
              events={events}
              selected={selected}
              onSelect={setSelected}
              onEdit={startEdit}
              onDelete={handleDelete}
              loading={loading}
            />
          )}

          {panel === "form" && (
            <EventForm
              initial={editing}
              onSubmit={editing ? handleUpdate : handleCreate}
              onCancel={cancelForm}
              loading={submitting}
            />
          )}
        </div>

        <div className="px-6 py-4 border-t border-ink/10">
          <p className="text-xs text-ink/25 font-mono">
            Coords stored in Decimal Degrees (DD)
          </p>
        </div>
      </aside>

      {/* Map Section (FIXED) */}
      <main className="flex-1 relative min-h-0 overflow-hidden">
        <EventMap
          events={events}
          selected={selected}
          onSelect={(ev) => {
            setSelected(ev);
            setPanel("list");
          }}
        />

        {selected && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000]">
            <div className="bg-black text-white px-4 py-2 rounded-lg flex gap-3">
              <span>●</span>
              <span>{selected.title}</span>
              <button onClick={() => setSelected(null)}>✕</button>
            </div>
          </div>
        )}
      </main>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
