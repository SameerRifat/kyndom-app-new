"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

export default ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = api.user.isAuthenticated.useQuery();

  return (
    <div className="lgMd:min-w-screen flex h-screen lgMd:max-h-screen flex-col gap-y-12 bg-white lgMd:flex-row lgMd:justify-between">
      <div className="hidden lgMd:flex lgMd:w-1/2 p-4 pr-0">
        <img
          className="h-full w-full rounded-2xl object-cover object-right"
          src="/img/auth.jpg"
          alt="Skyscrapers"
        />
      </div>
      <div className="w-full lgMd:w-1/2 lgMd:h-screen lgMd:max-h-screen overflow-y-auto p-4 py-8">
        <div className="flex items-center justify-center min-h-full">
          {isAuthenticated.isSuccess &&
          isAuthenticated.data &&
          isAuthenticated.data !== null &&
          !pathname.includes("logout") &&
          !pathname.includes("verify") ? (
            <div className="flex w-96 flex-col gap-y-3">
              <div className="flex w-full flex-col gap-y-1 rounded-xl bg-[#F9F9F9] p-5">
                <h1 className="font-elmessiri text-3xl font-bold leading-6">
                  Welcome back, {isAuthenticated.data.name}
                </h1>
                <h1 className="text-sm">
                  Your already logged in, were you looking to go to the
                  Dashboard?
                </h1>
              </div>
              <Button
                variant={"default"}
                size={"xl"}
                onClick={() => router.push("/dashboard/home")}
              >
                Go To Dashboard
              </Button>
              <Button
                variant={"outline"}
                size={"xl"}
                onClick={() => router.push("/auth/logout")}
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex w-96 h-auto flex-col items-center gap-y-8">
              <Image
                src={"/img/svg/sidebar-mobile-logo.svg"}
                alt={"Sidebar Mobile Logo"}
                width={123}
                height={35}
              />
              <div className="w-full">{children}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};