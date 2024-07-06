"use client";
import FormHeader from "@/app/_components/auth/form-header";
import { signOut } from "next-auth/react";
import { useEffect } from "react";

export default () => {
  useEffect(() => {
    signOut({ callbackUrl: "/auth/login" });
  }, []);

  return (
    <div className="flex flex-col gap-y-8">
      <div className="flex flex-col items-center gap-y-16">
        <FormHeader
          title={"Logging you out..."}
          subtitle={"Please standby while we log you out"}
        />
      </div>
    </div>
  );
};
