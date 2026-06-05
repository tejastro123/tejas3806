import { supabase } from "./supabaseClient";

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
  | "social_click";

export const trackEvent = async (
  event_type: EventType,
  event_label?: string,
  metadata: Record<string, unknown> = {},
) => {
  try {
    if (typeof window === "undefined") return;
    await supabase.from("analytics_events").insert({
      event_type,
      event_label: event_label ?? null,
      path: window.location.pathname,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
      session_id: getSessionId(),
      metadata,
    });
  } catch (err) {
    // Silently swallow analytics errors — never break the UX
    if (import.meta.env.DEV) console.warn("trackEvent failed:", err);
  }
};
