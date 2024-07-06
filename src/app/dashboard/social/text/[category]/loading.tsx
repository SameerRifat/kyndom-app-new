import ContentPageLoading from "@/app/_components/dashboard/general/content-page-loading";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingPage = () => {
  return (
    <div className="flex flex-col gap-y-6">
      <Skeleton className="h-20 w-96 rounded-xl" />
      <div className="flex flex-col gap-4 md:flex-row md:justify-end">
        <Skeleton className="roudned-xl h-[42px] w-32" />
        <Skeleton className="roudned-xl h-[42px] w-32" />
      </div>
      <Skeleton className="roudned-xl h-12 w-48" />
      <ContentPageLoading/>
    </div>
  );
};

export default LoadingPage;
