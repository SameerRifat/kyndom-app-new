import { create } from "zustand";

const useStore = create((set) => ({
  user: null,
  //   settings: null,
  setUser: (user) => set({ user }),
  //   setSettings: (settings) => set({ settings }),
}));

export default useStore;
