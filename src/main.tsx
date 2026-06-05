import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import "@/app/config/i18n";
import { initSessionTracker } from "@/services/api/analytics";

// Initialize session and page view analytics tracking
initSessionTracker();

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
