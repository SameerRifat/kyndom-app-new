"use client";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ContentCalendar = () => {
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/dashboard/content-calendar");
  }, []);

  return (
    <div className="dash-cal-widget font-pjs flex w-full flex-col">
      <div className="flex w-full items-center justify-between">
        <Button
          variant={"link"}
          size={"xlIcon"}
          className="truncate text-base text-orange"
          onClick={() => router.push("/dashboard/content-calendar")}
        >
          Open Content Calendar
        </Button>
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-orange">
          <CalendarIcon size={18} />
        </div>
      </div>
      <div className="hidden flex-col font-semibold text-dark-gray md:flex">
        <div className="flex flex-col text-lg">
          <span>
            {new Date().getHours()}:
            {new Date().getMinutes() > 10
              ? new Date().getMinutes()
              : `0${new Date().getMinutes()}`}
          </span>
          <span>
            {new Date().toLocaleString("default", { weekday: "long" })}
          </span>
        </div>
        <div className="text-3xl">
          {new Date().getDate()}{" "}
          {new Date().toLocaleString("default", { month: "long" })}
        </div>
      </div>
    </div>
  );
};

export default ContentCalendar;
