import { create } from "zustand";

const useThemeStore = create((set) => ({
  isDarkMode: localStorage.getItem("theme") === "dark" || false,

  setIsDarkMode: (value) =>
    set(() => {
      localStorage.setItem("theme", value ? "dark" : "light");
      return { isDarkMode: value };
    }),
}));

export default useThemeStore;
