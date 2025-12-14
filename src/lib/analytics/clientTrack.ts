export async function trackEvent(type: string, context: Record<string, any> = {}) {
  try {
    await fetch("/api/analytics/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type,
        context,
      }),
    });
  } catch (err) {
    // swallow error on purpose; tracking should NEVER block UI
    console.error("trackEvent failed", err);
  }
}
