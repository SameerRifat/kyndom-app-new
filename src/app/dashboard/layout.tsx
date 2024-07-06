"use client";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import DashboardHomeFooter from "../_components/dashboard/home/footer";
import Sidebar from "../_components/dashboard/sidebar";
import LoadingPage from "./loading";

const getWidthStyling = (pathname: string) => {
  const fullWidthPaths = [
    "/dashboard/content-vault",
    "/dashboard/used-content",
    "/dashboard/favourites",
    "/dashboard/social/content",
    "/dashboard/social/text",
  ];

  for (let i = 0; i < fullWidthPaths.length; i++) {
    let p = fullWidthPaths[i];
    if (p && pathname.includes(p)) return "w-full 2xl:max-w-full";
  }

  if (pathname.includes("/dashboard/content-calendar")) {
    return "w-full xlMd:max-w-[1400px]";
  }

  if (pathname.includes("/dashboard/home")) {
    return "w-full xlMd:max-w-[1200px] 2xl:max-w-[1400px]";
  }

  return "w-full xlMd:max-w-[1200px]";
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-full flex-col bg-[#F6F6F6] lgMd:h-screen lgMd:max-h-screen lgMd:flex-row lgMd:overflow-hidden">
      <Sidebar />
      <div className="flex h-full w-full flex-col justify-between overflow-y-auto overflow-x-hidden md:h-screen md:min-h-screen">
        <div className="flex w-full justify-center">
          <div
            className={`flex flex-col ${getWidthStyling(pathname)} m-4 lgMd:m-8 w-full !max-w-[1400px]`}
          >
            <Suspense fallback={<LoadingPage />}>{children}</Suspense>
          </div>
        </div>
        <DashboardHomeFooter />
      </div>
    </div>
  );
};

export default DashboardLayout;
