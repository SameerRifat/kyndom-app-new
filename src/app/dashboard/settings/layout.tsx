"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-y-8">
      <div className="flex w-full items-center justify-between">
        <h1 className="font-elmessiri text-2xl leading-6">Account Settings</h1>
      </div>
      <div className="flex w-full gap-x-8 border-b border-solid px-8">
        <Link
          className={`${pathname === "/dashboard/settings" ? "settings-nav-active" : ""} settings-nav`}
          href={"/dashboard/settings"}
        >
          Account
        </Link>
        <Link
          className={`${pathname === "/dashboard/settings/billing" ? "settings-nav-active" : ""} settings-nav`}
          href={"/dashboard/settings/billing"}
        >
          Membership
        </Link>
        {/* <Link className={`settings-nav`} href={"/auth/logout"}>
          Logout
        </Link> */}
      </div>
      <div>{children}</div>
    </div>
  );
};

export default AccountLayout;
