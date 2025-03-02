// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "../index.css";

// Add these packages to your package.json:
// "dependencies": {
//   "@dfinity/auth-client": "^0.19.3",
//   "@dfinity/identity": "^0.19.3",
//   "@dfinity/principal": "^0.19.3",
//   "react-router-dom": "^6.8.0",
//   ...rest of your dependencies
// }

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);