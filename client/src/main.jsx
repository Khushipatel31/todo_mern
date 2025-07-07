import { createRoot } from "react-dom/client";
import "./index.css";
import AuthProvider from "./auth/AuthProvider";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
