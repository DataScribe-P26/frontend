import { create } from "zustand";
 
const useOrganizationStore = create((set) => ({
  userRole: localStorage.getItem("userRole") || null, // Retrieve role from localStorage if available
 
  setRole: (userRole) => {
    localStorage.setItem("userRole", userRole); // Persist role in localStorage
    set({ userRole });
  },
 
  clearRole: () => {
    localStorage.removeItem("userRole");
    set({ userRole: null });
  },
}));
 
export default useOrganizationStore;
 