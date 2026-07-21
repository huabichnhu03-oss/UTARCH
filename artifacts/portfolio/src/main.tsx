import { createRoot } from "react-dom/client";
import { setBaseUrl } from "@workspace/api-client-react";
import App from "./App";
import "./index.css";

// When frontend (Vercel) and API (Render) are on different origins, set VITE_API_URL.
const apiBase = import.meta.env.VITE_API_URL as string | undefined;
if (apiBase) {
  setBaseUrl(apiBase.replace(/\/+$/, ""));
}

createRoot(document.getElementById("root")!).render(<App />);
