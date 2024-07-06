'use client'

import ContentPageLoading from "@/app/_components/dashboard/general/content-page-loading";
import { Skeleton } from "@/components/ui/skeleton";
import { usePathname } from "next/navigation";
import { Loader2Icon } from "lucide-react";

const LoadingPage = () => {
  const pathName = usePathname();
  if (pathName === '/dashboard/home' || pathName.includes('settings')) {
    return (
      <div className="flex w-full items-center justify-center"
        style={{height: 'calc(100vh - 150px)'}}
      >
        <div className="animate-spin">
          <Loader2Icon className="text-primary" size={40} />
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-y-6">
      <Skeleton className="h-20 w-96 rounded-xl" />
      <div className="flex flex-col gap-4 md:flex-row md:justify-end">
        <Skeleton className="roudned-xl h-[42px] w-32" />
        <Skeleton className="roudned-xl h-[42px] w-32" />
      </div>
      <Skeleton className="roudned-xl h-12 w-48" />
      <ContentPageLoading />
    </div>
  );
};

export default LoadingPage;
