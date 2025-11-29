import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

document.documentElement.classList.add("dark");
document.body.classList.add("theme-dark");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);