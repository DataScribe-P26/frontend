import React, { useEffect } from "react";

import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./App.css";
import useThemeStore from "./state/store/themeStore/themStore";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId =
  "849832574401-u80ur1j46qvdt7lr9lnatak8h6koj3l4.apps.googleusercontent.com"; // Replace with your actual Google Client ID

const Root = () => {
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return <App />;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <React.StrictMode>
      <GoogleOAuthProvider clientId={clientId}>
        <Root />
      </GoogleOAuthProvider>
    </React.StrictMode>
  </BrowserRouter>
);
