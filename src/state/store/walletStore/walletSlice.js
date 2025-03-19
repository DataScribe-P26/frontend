import { create } from "zustand";

const useWalletStore = create((set) => ({
  user_id: null,
  setUserId: (id) => set({ user_id: id }),

  balance: 0,
  setBalance: (amount) => set({ balance: amount }),

  totalPurchased: 0,
  setTotalPurchased: (amount) => set({ totalPurchased: amount }),

  history: [],
  setHistory: (newHistory) => set({ history: newHistory }),
  addHistoryItem: (item) =>
    set((state) => ({ history: [...state.history, item] })),
}));

export default useWalletStore;
