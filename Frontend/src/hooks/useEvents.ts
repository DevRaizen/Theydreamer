import { useEffect, useState } from "react";
import { api } from "../utils/api";

export function useEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchEvents() {
    try {
      setLoading(true);

      const data = await api.getEvents();

      console.log("API RESPONSE:", data);

      // ALWAYS SAFE
      setEvents(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load events");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  function normalizeId(id: any) {
    if (!id) throw new Error("Invalid ID");
    if (typeof id === "object") return id.id;
    return id;
  }

  async function createEvent(payload: any) {
    const res = await api.createEvent(payload);
    await fetchEvents();
    return res;
  }

  async function updateEvent(id: any, payload: any) {
    const cleanId = normalizeId(id);
    await api.updateEvent(cleanId, payload);
    await fetchEvents();

    // optional: return nothing or refetched list
  }

  async function deleteEvent(id: any) {
    const cleanId = normalizeId(id);
    const res = await api.deleteEvent(cleanId);
    await fetchEvents(); // ← refresh list
    return res;
  }

  return {
    events,
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    refetch: fetchEvents,
  };
}
