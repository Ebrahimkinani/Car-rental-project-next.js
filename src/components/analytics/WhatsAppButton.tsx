"use client";

import { trackEvent } from "@/lib/analytics/clientTrack";

export function WhatsAppButton({
  carId,
  phone,
}: {
  carId: string;
  phone: string;
}) {
  const handleClick = () => {
    trackEvent("CAR_WHATSAPP_CLICK", {
      carId,
      phone,
      sourcePage: window.location.pathname,
    });

    window.location.href = `https://wa.me/${phone}`;
  };

  return (
    <button
      onClick={handleClick}
      className="rounded-md bg-green-500 px-4 py-2 text-white font-medium hover:bg-green-600 transition-colors"
    >
      WhatsApp
    </button>
  );
}
