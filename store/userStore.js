import create from "zustand";
import { api } from "@/trpc/react";

const useUserStore = create((set) => ({
  user: null,
  fetchUser: async () => {
    const userQuery = api.user.me.useQuery();
    if (userQuery.isSuccess && userQuery.data) {
      set({ user: userQuery.data });
    }
  },
}));

export default useUserStore;
