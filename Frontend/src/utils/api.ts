const BASE = "http://localhost:3000/api";

async function request(method: string, path: string, body?: any) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    console.error("Server returned:", text);
    throw new Error("Backend did not return JSON");
  }

  if (!res.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
}

export const api = {
  getEvents: () => request("GET", "/events"),
  getEvent: (id: string | number) => request("GET", `/events/${id}`),
  createEvent: (payload: any) => request("POST", "/events", payload),
  updateEvent: (id: string | number, payload: any) =>
    request("PUT", `/events/${id}`, payload),
  deleteEvent: (id: string | number) => request("DELETE", `/events/${id}`),
};
