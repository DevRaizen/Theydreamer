import CryptoJS from "crypto-js";

const KEY = import.meta.env.VITE_ENCRYPTION_KEY || "";

export function decrypt(encryptedText: string): any {
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
