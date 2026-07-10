import CryptoJS from "crypto-js";
const BASE = "http://localhost:3000/api";
const KEY = import.meta.env.VITE_ENCRYPTION_KEY || "";

function decrypt(encryptedText: string): any {
  try {
    const [ivHex, encryptedHex] = encryptedText.split(":");
    const iv = CryptoJS.enc.Hex.parse(ivHex);
    const encrypted = CryptoJS.enc.Hex.parse(encryptedHex);
    const key = CryptoJS.enc.Utf8.parse(KEY);

    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: encrypted } as any,
      key,
      { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 },
    );

    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  } catch (err) {
    console.error("Decrypt error:", err);
    return null;
  }

}

async function request(method: string, path: string, body?: any) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
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
  getEvents: () => {
    return request("GET", "/events").then((data) => decrypt(data.payload));
  },
  getEvent: (id: string | number) => request("GET", `/events/${id}`).then((data) => decrypt(data.payload)),
  createEvent: (payload: any) => request("POST", "/events", payload).then((data) => decrypt(data.payload)),
  updateEvent: (id: string | number, payload: any) =>
    request("PUT", `/events/${id}`, payload),
  deleteEvent: (id: string | number) => request("DELETE", `/events/${id}`),
};
