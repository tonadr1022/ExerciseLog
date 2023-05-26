import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById("root")).render(app);
