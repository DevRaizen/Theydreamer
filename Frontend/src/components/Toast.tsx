import React, { useEffect } from "react";

export default function Toast({ message, type = "success", onClose }: { message: string; type?: "success" | "error"; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors = {
    success: "bg-ink text-parchment",
    error: "bg-coral text-white",
  };

  return (
    <div
      className={`
        fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]
        px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold
        animate-fade-up ${colors[type]}
      `}
    >
      {message}
    </div>
  );

}

