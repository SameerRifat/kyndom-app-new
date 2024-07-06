"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";
import ColView from "../general/col-view";
import SocialPost from "../social-content/social-template";
import CardLoading from "../general/card-loading";

const TodaysPost = () => {
  const socialTemplates = api.socialContent.getTodaysPost.useQuery();

  return (
    <div className="w-full xl:col-span-1">
      <div className="flex w-full items-center justify-between mb-4 md:mb-8">
        <h1 className="font-elmessiri text-2xl leading-6">Today's Post</h1>
      </div>
      {socialTemplates.data && (
        <div className={`w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 xl:grid-cols-1 gap-4 md:gap-6`}>
          {socialTemplates.data.map((template, index) => (
            <SocialPost
              template={template}
              colview={true}
              key={`recent-post-${index}`}
            />
          ))}
        </div>
      )}
      {!socialTemplates.data && (
        <div className={`w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 xl:grid-cols-1 gap-4 md:gap-6`}>
          <CardLoading />
        </div>
      )}
    </div>
  );
};

export default TodaysPost;
