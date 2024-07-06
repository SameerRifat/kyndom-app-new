'use client'

import { useEffect } from "react";
import { api } from "@/trpc/react";
import useStore from "store/useStore";

const StoreProvider = ({ children }) => {
  const setUser = useStore((state) => state.setUser);

  const { data: user } = api.user.me.useQuery();

  useEffect(() => {
    if (user) setUser(user);
  }, [user, setUser]);

  return children;
};

export default StoreProvider;
