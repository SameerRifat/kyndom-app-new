"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";
import { SocialContentCategory, SocialTextCategory } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ColView from "../general/col-view";
import SocialContentTemplate from "../social-content/social-template";
import SocialTextTemplate from "../social-text/social-text-template";
import FullPageRow from "../general/full-page-row";
import ContentPageLoading from "../general/content-page-loading";
import CardLoading from "../general/card-loading";

export const HomeContentTemplates = ({
  title,
  category,
  viewMore = true,
}: {
  title: string;
  category?: SocialContentCategory;
  viewMore?: boolean;
}) => {
  const router = useRouter();
  const socialContentTemplates = api.socialContent.getRecentTemplates.useQuery({
    category,
    take: 4,
  });

  return (
    <div className="flex flex-col gap-y-1">
      <div className="flex w-full items-center justify-between mb-5">
        <h1 className="font-elmessiri text-2xl leading-6">{title}</h1>
        {viewMore && (
          <div
            className="div-cursor text-base font-semibold text-primary"
            onClick={() =>
              router.push(`/dashboard/social/content/${category}`.toLowerCase())
            }
          >
            View More
          </div>
        )}
      </div>
      {socialContentTemplates.data && (
        <FullPageRow>
          {socialContentTemplates.data.map((template, index) => (
            <SocialContentTemplate
              template={template}
              colview={true}
              onlyShowLarge={index === 3} //hide fourth template on mobile
              key={`colview-template-${template.id}`}
            />
          ))}
        </FullPageRow>
      )}

      {!socialContentTemplates.data && (
        <ContentPageLoading extraHeight={96} loadingItems={4} />
      )}

    </div>
  );
};

export const HomeTextTemplates = ({
  title,
  category,
}: {
  title: string;
  category: SocialTextCategory;
}) => {
  const router = useRouter();
  const socialTextTemplates = api.socialText.getRecentTextTemplates.useQuery({
    category,
    take: 4,
  });

  const categoryUrl = `/dashboard/social/text/${category}`.toLowerCase();

  useEffect(() => {
    router.prefetch(categoryUrl);
  }, []);

  return (
    <div className="flex flex-col gap-y-1">
      <div className="flex w-full items-center justify-between mb-5">
        <h1 className="font-elmessiri text-2xl leading-6">{title}</h1>
        <div
          className="div-cursor text-base font-semibold text-primary"
          onClick={() => router.push(categoryUrl)}
        >
          View More
        </div>
      </div>
      {socialTextTemplates.data && (
        <FullPageRow>
          {socialTextTemplates.data.map((template, index) => (
            <SocialTextTemplate
              template={template}
              colview={true}
              onlyShowLarge={index === 3}
              key={`col-view-template-r-${template.id}`}
            />
          ))}
        </FullPageRow>
      )}

      {!socialTextTemplates.data && (
        <FullPageRow>
          {Array.from(Array(4).keys()).map((row, index) => (
            <CardLoading key={index} />
          ))}
        </FullPageRow>
      )}
    </div>
  );
};
