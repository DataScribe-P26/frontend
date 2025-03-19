import { useEffect } from "react";
import useThemeStore from "../state/store/themeStore/themeSlice";

export const ThemeProvider = ({ children }) => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return children;
};

// Replace the Context hook with a function that returns the same shape of object
export const useTheme = () => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const setIsDarkMode = useThemeStore((state) => state.setIsDarkMode);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return { isDarkMode, toggleTheme };
};
