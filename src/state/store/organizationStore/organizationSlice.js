import { create } from "zustand";

const useOrganizationStore = create((set) => ({
  userRole: localStorage.getItem("userRole") || null,
  orgId: localStorage.getItem("orgId"),
  setOrgId: (id) => {
    console.log("id changed", id);
    localStorage.setItem("orgId", id);
    set({ orgId: id });
  },

  setRole: (userRole) => {
    localStorage.setItem("userRole", userRole);
    set({ userRole });
  },

  clearRole: () => {
    localStorage.removeItem("userRole");
    set({ userRole: null, orgId: null });
  },
}));

export default useOrganizationStore;
