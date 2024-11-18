import React, { createContext, useContext, useState } from "react";

// Create a Theme Context
const ThemeContext = createContext();

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setDarkMode] = useState(false);

  const toggleTheme = () => setDarkMode(!isDarkMode);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom Hook to use Theme Context
export const useTheme = () => useContext(ThemeContext);
