"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";
import Image from "next/image";
import useStore from "store/useStore";

const WelcomeMotd = () => {
  const message = api.motd.getMotd.useQuery();

  const user = useStore((state) => state.user);

  if (!message.data)
    return <Skeleton className="h-[152px] w-full rounded-xl md:h-44" />;

  return (
    <div className="dash-overview-widget flex">
      <div>
        <Image
          src={"/img/svg/overview.svg"}
          alt="Overview"
          width={130}
          height={130}
        />
      </div>
      <div className="flex flex-col gap-y-2">
        <h1 className="text-lg font-semibold sm:text-[27px] leading-7 2xl:leading-10">
          Hi {" "}
          {user ? (
            <>{user.name}, {" "}</>
          ) : (
            <><Skeleton className="h-[24px] w-20 inline-block" /> {" "},</>
          )} {message.data.header}
        </h1>
        <div className="text-xs font-light text-white sm:text-sm">
          {message.data.subheader}
        </div>
      </div>
    </div>
  );
};

export default WelcomeMotd;
