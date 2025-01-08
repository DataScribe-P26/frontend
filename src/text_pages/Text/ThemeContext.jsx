import React, { createContext, useContext, useState, useEffect } from "react";

// Create a Theme Context
const ThemeContext = createContext();

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  // Retrieve the saved theme mode from local storage (if any), default to light mode (false)
  const storedTheme = localStorage.getItem("isDarkMode");
  const [isDarkMode, setDarkMode] = useState(storedTheme === "true");

  // Toggle the theme mode
  const toggleTheme = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      // Save the new theme mode to local storage
      localStorage.setItem("isDarkMode", newMode);
      return newMode;
    });
  };

  useEffect(() => {
    // Check local storage for the theme mode on component mount
    const storedTheme = localStorage.getItem("isDarkMode");
    if (storedTheme) {
      setDarkMode(storedTheme === "true");
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom Hook to use Theme Context
export const useTheme = () => useContext(ThemeContext);
