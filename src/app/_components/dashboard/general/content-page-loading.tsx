import { Skeleton } from "@/components/ui/skeleton";
import FullPageRow from "./full-page-row";
import { cn } from "@/lib/utils";

type ContentPageLoadingProps = {
  extraHeight?: number;
  loadingItems?: number
};

const ContentPageLoading = ({ extraHeight = 96, loadingItems = 24 }: ContentPageLoadingProps) => {
  return (
    <>
      <FullPageRow>
        {Array.from(Array(loadingItems).keys()).map((row, index) => (
          <div
            key={`content-calendar-loading-${index}`}
            className="relative w-full overflow-hidden rounded-2xl"
            style={{
              paddingBottom: `calc(100% * 5 / 4 + ${extraHeight}px)`, 
              height: 0,
            }}
          >
            <Skeleton className="absolute top-0 left-0 w-full h-full rounded-2xl" />
          </div>
        ))}
      </FullPageRow>
    </>
  );
};

export default ContentPageLoading;
