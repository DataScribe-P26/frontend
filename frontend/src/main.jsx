import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./App.css";
import { ThemeProvider } from "./text_pages/Text/ThemeContext.jsx";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
    </React.StrictMode>
  </BrowserRouter>
);
