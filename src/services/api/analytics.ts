import { apiClient } from "./apiClient";

const SESSION_KEY = "portfolio_session_id";

const getSessionId = (): string => {
  if (typeof window === "undefined") return "ssr";
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
};

export type EventType =
  | "page_view"
  | "project_click"
  | "resume_download"
  | "contact_submit"
  | "blog_click"
  | "social_click"
  | "session_ping";

export const trackEvent = async (
  event_type: EventType,
  event_label?: string,
  metadata: Record<string, unknown> = {},
) => {
  try {
    if (typeof window === "undefined") return;
    await apiClient.from("analytics_events").insert({
      event_type,
      event_label: event_label ?? "",
      path: window.location.pathname,
      referrer: document.referrer || "",
      user_agent: navigator.userAgent,
      session_id: getSessionId(),
      metadata,
    });
  } catch (err) {
    if (import.meta.env.DEV) console.warn("trackEvent failed:", err);
  }
};

let sessionStartTime = Date.now();

export const initSessionTracker = () => {
  if (typeof window === "undefined") return;
  sessionStartTime = Date.now();

  // Track page view on initial load
  trackEvent("page_view", window.location.pathname);

  // Send periodic session pings to measure active duration
  const interval = setInterval(() => {
    const elapsedSeconds = Math.round((Date.now() - sessionStartTime) / 1000);
    apiClient.from("analytics_events").insert({
      event_type: "session_ping",
      path: window.location.pathname,
      session_id: getSessionId(),
      duration: elapsedSeconds
    }).catch(() => {});
  }, 10000);

  // Send beacon with total duration on unload
  window.addEventListener("pagehide", () => {
    const elapsedSeconds = Math.round((Date.now() - sessionStartTime) / 1000);
    try {
      const payload = JSON.stringify({
        event_type: "session_ping",
        path: window.location.pathname,
        session_id: getSessionId(),
        duration: elapsedSeconds
      });
      navigator.sendBeacon("/api/analytics", payload);
    } catch (err) {}
  });
};
