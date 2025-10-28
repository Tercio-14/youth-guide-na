import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { auth } from "./config/firebase";

// Expose auth to window for console helpers
if (typeof window !== 'undefined') {
  (window as typeof window & { firebaseAuth: typeof auth }).firebaseAuth = auth;
}

createRoot(document.getElementById("root")!).render(<App />);
