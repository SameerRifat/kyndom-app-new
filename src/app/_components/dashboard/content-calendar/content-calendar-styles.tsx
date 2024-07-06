"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { ContentCalendarStyle } from "@prisma/client";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const CalendarStyles = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedStyle = searchParams.get("style") ?? undefined;

  const calendarStyles = api.contentCalendar.getCalendarStyles.useQuery();
  if (!calendarStyles.data) return null;

  return (
    <div className="flex flex-col items-center gap-y-4">
      <div className="flex flex-col gap-4 md:w-full md:flex-row md:justify-center">
        {calendarStyles.data.map((style) => (
          <CalendarStyle
            style={style}
            selectedStyle={selectedStyle}
            key={`calendar-style-${style.id}`}
          />
        ))}
      </div>
      {selectedStyle && (
        <Button
          size="lg"
          className="w-80 rounded-2xl"
          onClick={() => router.push(`/dashboard/content-calendar`)}
        >
          <ArrowLeftIcon size={20} />
          <div>View All Styles</div>
        </Button>
      )}
    </div>
  );
};

export default CalendarStyles;

const CalendarStyle = ({
  style,
  selectedStyle,
}: {
  style: ContentCalendarStyle;
  selectedStyle: undefined | string;
}) => {
  const router = useRouter();

  useEffect(() => {
    router.prefetch(`/dashboard/content-calendar?style=${style.id}`);
  }, []);

  if (!style.resourceName || !style.resourceUrl) return null;
  if (selectedStyle && style.id !== selectedStyle) return null;

  return (
    <div
      className={`flex h-80 max-h-80 w-80 flex-col rounded-2xl bg-white shadow-md ${!selectedStyle ? "hover:cursor-pointer" : ""}`}
      onClick={() =>
        router.push(`/dashboard/content-calendar?style=${style.id}`)
      }
    >
      <div
        className="h-64 w-full select-none rounded-tl-xl rounded-tr-xl object-cover p-3"
        style={{
          background: `url(${style.resourceUrl})`,
          backgroundSize: "cover",
        }}
      />
      <div className="flex flex-col gap-y-4 p-4">
        {selectedStyle ? (
          <div className="flex h-11 items-center justify-center truncate text-base font-semibold text-black">
            {style.style}
          </div>
        ) : (
          <Button size="lg" className="w-full">
            {style.style}
          </Button>
        )}
      </div>
    </div>
  );
};
