import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { convex } from "./lib/convex";
import "./index.css";
import App from "./App";

const root = document.getElementById("root")!;

if (!convex) {
  root.innerHTML = `
    <div style="max-width:32rem;margin:20vh auto;padding:2rem;font-family:system-ui,sans-serif;text-align:center">
      <h1 style="font-size:1.25rem;font-weight:700;margin-bottom:.75rem">Elise Reads isn't configured yet</h1>
      <p style="color:#64748b">The site was built without <code>VITE_CONVEX_URL</code>. Set it in your host's environment variables and redeploy.</p>
    </div>`;
} else {
  createRoot(root).render(
    <StrictMode>
      <ConvexAuthProvider client={convex}>
        <App />
      </ConvexAuthProvider>
    </StrictMode>,
  );
}
