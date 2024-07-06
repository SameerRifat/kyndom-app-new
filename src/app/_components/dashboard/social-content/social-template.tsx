"use client";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { Template } from "@/lib/schemas/generic";
import { api } from "@/trpc/react";
import { SocialContentCategory, SocialTemplateTag } from "@prisma/client";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { SocialTemplateModal } from "./social-modal";
import Image from "next/image";

const SocialTemplate = ({
  template,
  liked = false,
  colview = false,
  content_vault = false,
  onlyShowLarge = false,
}: {
  template: Template;
  sidebarKey?: string | null;
  liked?: boolean;
  colview?: boolean;
  content_vault?: boolean;
  onlyShowLarge?: boolean;
}) => {
  return (
    <div
      // className={`${onlyShowLarge ? "hidden 2xl:flex" : "flex"} min-w-80 flex-col transition-shadow hover:shadow-lg ${colview ? "w-full" : "w-full lgMd:w-[325px]"} ${content_vault ? "h-fit" : colview ? "h-fit" : "h-fit"} rounded-3xl border border-white bg-white font-plusjakartasans`}
      className="bg-white rounded-2xl shadow-md flex flex-col font-plusjakartasans h-fit hover:shadow-lg transition-all"
    >
      <div
        className="relative w-full"
      >
        <div className="w-full aspect-[4/5] max-h-[450px] rounded-tr-2xl rounded-tl-2xl relative">
          <Image
            src={template.previewImages?.at(0)?.resourceUrl || ''}
            alt="image"
            layout="fill"
            objectFit="cover"
            className="w-full h-full absolute top-0 left-0 rounded-tr-xl rounded-tl-xl"
            priority={true}
            quality={100}
          />
        </div>
        <div className="flex items-center justify-between p-3 w-full absolute top-0 left-0 rounded-tr-xl rounded-tl-xl">
          <div className="flex gap-x-2">
            <TemplateTag tag={template.tag} />
          </div>
          <TemplateLiked
            id={template.id}
            template={template}
            liked={liked || (template.liked ?? false)}
          />
        </div>
      </div>
      <div className="flex flex-col gap-y-3 px-4 py-3">
        <Tooltip>
          <TooltipTrigger>
            <div className="truncate text-left text-base text-black">
              {template.title}
            </div>
          </TooltipTrigger>
          <TooltipContent sideOffset={4} className="text-sm">
            {template.title}
          </TooltipContent>
        </Tooltip>
        <SocialTemplateModal contentTemplate={template} />
      </div>
    </div>
  );
};

export default SocialTemplate;

export const TemplateTag = ({ tag }: { tag: SocialTemplateTag }) => {
  return (
    <Badge
      className="px-[11px] py-[3px] font-semibold line-clamp-1"
      style={{ background: tag.color, color: "white" }}
    >
      {tag.name}
    </Badge>
  );
};

export const TemplateLiked = ({
  id,
  template,
  liked,
}: {
  id: string;
  template: Template;
  liked: boolean;
}) => {
  const trpc = api.useUtils();
  const [likedPost, setLikedPost] = useState<boolean>(liked);
  const likeTemplateMutation =
    api.socialContent.likeSocialContentTemplate.useMutation();

  useEffect(() => {
    setLikedPost(liked);
  }, [liked]);

  const mapTemplateArray = (templates: Template[], newState: boolean) => {
    return templates.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          liked: newState,
        };
      }
      return t;
    });
  };

  const updateContentCategories = (newState: boolean) => {
    const categories = [
      "SOCIAL_MEDIA",
      "STORY_TEMPLATES",
      "PRINTABLE",
      "EMAIL",
      "BRANDING",
    ] as SocialContentCategory[];
    trpc.socialContent.getRecentTemplates.setData(
      {
        take: 1,
      },
      (data) => {
        return data ? mapTemplateArray(data, newState) : undefined;
      },
    );
    categories.forEach((category: SocialContentCategory) => {
      trpc.socialContent.getRecentTemplates.setData(
        {
          category: category,
          take: 4,
        },
        (data) => {
          return data ? mapTemplateArray(data, newState) : undefined;
        },
      );
      trpc.socialContent.getSocialContentTemplates.setData(
        {
          filter_category: [category],
          sort_by: "newest",
          skip: 0,
          take: 25,
        },
        (data) =>
          data?.templates
            ? {
              total: data.total,
              templates: mapTemplateArray(data.templates, newState),
            }
            : undefined,
      );
    });
  };

  const likeTemplateToggle = async () => {
    const newState = !likedPost;
    setLikedPost(newState);
    try {
      const result = await likeTemplateMutation.mutateAsync({
        id,
        status: newState,
      });

      //If the "like" action was successful
      if (result) {
        updateContentCategories(newState);

        trpc.user.getFavouriteTemplates.setData(
          {
            sort_by: "newest",
            skip: 0,
            take: 25,
          },
          (data) => {
            const newFavouriteTemplates =
              newState === false
                ? (data?.templates
                  .map((template) => {
                    if (template.id === id && newState === false) {
                      return null;
                    } else return template;
                  })
                  .filter((t) => t !== null) as Template[]) ?? []
                : data?.templates
                  ? [...data.templates, ...[{ ...template, liked: true }]]
                  : [];

            return data?.templates
              ? {
                total: data?.total ?? 0,
                templates: newFavouriteTemplates,
              }
              : undefined;
          },
        );
        toast.success(!likedPost && "Added to favourites", {
          autoClose: 2000,
        });
      }
    } catch (e) {
      //If the "like" action failed on server
      setLikedPost(!newState);
      toast.error("Failed to like template");
    }
  };

  return (
    <div
      className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl bg-white transition-transform hover:scale-125 ${likeTemplateMutation.isLoading ? "" : "hover:cursor-pointer"}`}
      onClick={() => likeTemplateToggle()}
    >
      {likedPost ? (
        <svg
          width="18"
          height="17"
          viewBox="0 0 13 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 3.9293C0 7.05651 2.613 8.72269 4.5253 10.2146C5.2 10.7406 5.85 11.2364 6.5 11.2364C7.15 11.2364 7.8 10.7413 8.4747 10.214C10.3876 8.72333 13 7.05651 13 3.92994C13 0.802725 9.425 -1.4152 6.5 1.59176C3.575 -1.41584 0 0.802082 0 3.9293Z"
            fill="#FF5959"
          />
        </svg>
      ) : (
        <svg
          width="18"
          height="17"
          viewBox="0 0 13 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.15795 10.5516L8.15851 10.5511C8.34672 10.3975 8.53826 10.2445 8.73093 10.0906C9.54718 9.43884 10.3839 8.7707 11.075 7.96415C11.9124 6.98695 12.5 5.84264 12.5 4.35517C12.5 2.89433 11.7036 1.67969 10.6328 1.17241C9.59888 0.682587 8.20297 0.806425 6.86641 2.24587L6.49996 2.64052L6.13356 2.24583C4.79696 0.806044 3.40105 0.682099 2.36717 1.17184C1.29643 1.67903 0.5 2.89365 0.5 4.3545C0.5 5.84228 1.08773 6.98659 1.92521 7.96389C2.61521 8.7691 3.45007 9.43632 4.2648 10.0874C4.45899 10.2426 4.65204 10.3969 4.84172 10.552M8.15795 10.5516L4.84172 10.552M8.15795 10.5516C7.81613 10.8314 7.51184 11.0761 7.21904 11.2535C6.9256 11.4313 6.69354 11.5096 6.5 11.5096C6.30658 11.5096 6.07457 11.4312 5.78096 11.2533M8.15795 10.5516L5.78096 11.2533M4.84172 10.552C5.18377 10.8313 5.48802 11.0759 5.78096 11.2533M4.84172 10.552L5.78096 11.2533"
            stroke="#0C6E4F"
          />
        </svg>
      )}
    </div>
  );
};
