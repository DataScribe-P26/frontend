import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./App.css";
import { ThemeProvider } from "./text_pages/Text/ThemeContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId = "849832574401-u80ur1j46qvdt7lr9lnatak8h6koj3l4.apps.googleusercontent.com"; // Replace with your actual Google Client ID

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <React.StrictMode>
      <GoogleOAuthProvider clientId={clientId}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </GoogleOAuthProvider>
    </React.StrictMode>
  </BrowserRouter>
);
