'use client'

import DashboardCalendar from "@/app/_components/dashboard/home/calendar";
import {
  HomeContentTemplates,
  HomeTextTemplates,
} from "@/app/_components/dashboard/home/template-groups";
import TodaysPlan from "@/app/_components/dashboard/home/todays-plan";
import TodaysPost from "@/app/_components/dashboard/home/todays-post";
import DashboardWelcome from "@/app/_components/dashboard/home/welcome";
import { SocialContentCategory, SocialTextCategory } from "@prisma/client";
import useStore from "store/useStore";
import { api } from "@/trpc/react";
import { useEffect } from "react";

const DashboardHome = () => {
  const setUser = useStore((state) => state.setUser);

  const { data: user } = api.user.me.useQuery();

  useEffect(() => {
    if (user) setUser(user);
  }, []);

  return (
    <div className="flex flex-col gap-y-10 md:gap-y-14 pb-8 md:pb-10">
      <div className="flex w-full flex-col gap-y-6 md:flex-row md:gap-x-3 md:gap-y-0">
        <div className="w-full md:w-[70%]">
          <DashboardWelcome />
        </div>
        <div className="w-full md:w-[30%]">
          <DashboardCalendar />
        </div>
      </div>
      <div
        className="grid grid-cols-1 xl:grid-cols-4 gap-y-10 xl:gap-x-5 2xl:gap-8"
        // className="flex gap-x-6 gap-y-10 flex-col md:flex-row"
        // className="flex flex-col gap-y-6 md:flex-row md:justify-start md:gap-x-6 md:gap-y-0"
      >
        <TodaysPost />
        <TodaysPlan />
      </div>
      <HomeTextTemplates
        title="Reels Ideas"
        category={SocialTextCategory.REELS_IDEAS}
      />
      <HomeTextTemplates
        title="Story Ideas"
        category={SocialTextCategory.STORY_IDEAS}
      />
      <HomeContentTemplates
        title="Social Media"
        category={SocialContentCategory.SOCIAL_MEDIA}
      />
      <HomeContentTemplates
        title="Story Templates"
        category={SocialContentCategory.STORY_TEMPLATES}
      />
      <HomeContentTemplates title="Newly Released" viewMore={false}/>
    </div>
  );
};

export default DashboardHome;
