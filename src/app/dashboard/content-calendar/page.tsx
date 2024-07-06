"use client";
import ContentCalendar from "@/app/_components/dashboard/content-calendar/content-calendar";
import MonthSwitcher from "@/app/_components/dashboard/content-calendar/month-switcher";
import { Suspense, useState } from "react";

const ContentCalendarPage = () => {
  const [dateRef, setDateRef] = useState<Date>(new Date());
  const [vaultToggleFilters, setVaultToggleFilters] = useState<boolean>(false);

  return (
    <Suspense>
      <div className="flex flex-col gap-y-8 pb-8">
        <h1 className="py-6 font-elmessiri text-3xl leading-6">
          Content Calendar
        </h1>

        <div className="flex w-full flex-col gap-y-10">
          <MonthSwitcher date={dateRef} setDate={setDateRef} vaultToggleFilters={vaultToggleFilters} setVaultToggleFilters={setVaultToggleFilters}/>
          <ContentCalendar date={dateRef} vaultToggleFilters={vaultToggleFilters}/>
        </div>
      </div>
    </Suspense>
  );
};

export default ContentCalendarPage;
