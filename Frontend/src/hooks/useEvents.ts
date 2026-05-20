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

  async function createEvent(payload: any) {
    const res = await api.createEvent(payload);
    await fetchEvents();
    return res;
  }

  async function updateEvent(id: number, payload: any) {
    const res = await api.updateEvent(id, payload);
    await fetchEvents();
    return res;
  }

  async function deleteEvent(id: number) {
    const res = await api.deleteEvent(id);
    await fetchEvents();
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
