"use client";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Template } from "@/lib/schemas/generic";
import { api } from "@/trpc/react";
import { SocialTemplateTag, SocialTextCategory } from "@prisma/client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useStore from "store/useStore";
import SharedDialogContent from "../shared/SharedDialogContent";

const StoryTag = ({ tag }: { tag: SocialTemplateTag }) => {
  return (
    <Badge style={{ background: tag.color, color: "white" }} className="line-clamp-1">{tag.name}</Badge>
  );
};

const SocialTextTemplate = ({
  template,
  colview = false,
  liked = false,
  content_vault = false,
  onlyShowLarge = false,
}) => {
  const [isParentDialogOpen, setIsParentDialogOpen] = useState(false);
  const user = useStore((state) => state.user);

  // const generatePrompt = () => `
  //   You are my real estate assistant. Please personalize/customize the template below based on my saved profile information:
  //   "Title: ${template.title}.
    
  //   content: ${template.content}."
    
  //   Note: only add bullets if necessary otherwise not.
  // `;

  return (
    <Dialog open={isParentDialogOpen} onOpenChange={setIsParentDialogOpen}>
      <DialogTrigger asChild>
      <div
          // className={`${onlyShowLarge ? "hidden 2xl:flex" : "flex"}  min-w-72 flex-col gap-y-2 p-5 ${colview ? "w-full" : "w-full md:w-[325px]"} ${content_vault ? "h-fit md:h-80" : colview ? "h-fit md:h-80" : "h-fit md:h-80"} rounded-3xl border border-white bg-white font-plusjakartasans hover:cursor-pointer`}
          // className="aspect-[4/5] xs:aspect-[4/6] overflow-hidden rounded-2xl bg-white font-plusjakartasans hover:cursor-pointer flex-col px-5 shadow-md hover:shadow-lg transition-all flex items-center justify-center"
          // style={{
          //   paddingBottom: `calc(100% * 5 / 4 + 96px)`,
          //   height: 0,
          // }}
          className={`relative max-h-[450px] overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-lg hover:cursor-pointer`}
          style={{
            paddingBottom: `calc(100% * 5 / 4 + 96px)`,
            height: 0,
          }}
        >
          <div
            // className="h-[90%] overflow-hidden"
            className="absolute top-[48%] left-0 -translate-y-1/2 w-full h-[96%] px-5 font-plusjakartasans overflow-hidden pt-3.5"
          >
            <div className="flex w-full items-center justify-between gap-3">
              <StoryTag tag={template.tag} />
              <TemplateLiked
                id={template.id}
                template={template}
                liked={liked || (template.liked ?? false)}
              />
            </div>
            <h1 className="text-[20px] font-semibold text-dark-gray my-3 line-clamp-2">
              {template.title}
            </h1>
            {/* <div className="text-sm text-light-gray">
              {template.content}
            </div> */}
            <div
              className="text-sm text-light-gray line-clamp"
              dangerouslySetInnerHTML={{
                __html: template.content ? template.content.replace(/\n/g, '<br/>') : ''
              }}
            ></div>
          </div>
        </div>
      </DialogTrigger>
      <SharedDialogContent
        template={template}
        user={user} 
        setIsParentDialogOpen={setIsParentDialogOpen}
      />
    </Dialog>
  );
};

// const SocialTextTemplate = ({
//   template,
//   colview = false,
//   liked = false,
//   content_vault = false,
//   onlyShowLarge = false,
// }: {
//   template: Template;
//   liked?: boolean;
//   colview?: boolean;
//   content_vault?: boolean;
//   onlyShowLarge?: boolean;
// }) => {
//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <div
//           // className={`${onlyShowLarge ? "hidden 2xl:flex" : "flex"}  min-w-72 flex-col gap-y-2 p-5 ${colview ? "w-full" : "w-full md:w-[325px]"} ${content_vault ? "h-fit md:h-80" : colview ? "h-fit md:h-80" : "h-fit md:h-80"} rounded-3xl border border-white bg-white font-plusjakartasans hover:cursor-pointer`}
//           // className="aspect-[4/5] xs:aspect-[4/6] overflow-hidden rounded-2xl bg-white font-plusjakartasans hover:cursor-pointer flex-col px-5 shadow-md hover:shadow-lg transition-all flex items-center justify-center"
//           // style={{
//           //   paddingBottom: `calc(100% * 5 / 4 + 96px)`,
//           //   height: 0,
//           // }}
//           className={`relative max-h-[450px] overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-lg hover:cursor-pointer`}
//           style={{
//             paddingBottom: `calc(100% * 5 / 4 + 96px)`,
//             height: 0,
//           }}
//         >
//           <div
//             // className="h-[90%] overflow-hidden"
//             className="absolute top-[48%] left-0 -translate-y-1/2 w-full h-[96%] px-5 font-plusjakartasans overflow-hidden pt-3.5"
//           >
//             <div className="flex w-full items-center justify-between gap-3">
//               <StoryTag tag={template.tag} />
//               <TemplateLiked
//                 id={template.id}
//                 template={template}
//                 liked={liked || (template.liked ?? false)}
//               />
//             </div>
//             <h1 className="text-[20px] font-semibold text-dark-gray my-3 line-clamp-2">
//               {template.title}
//             </h1>
//             {/* <div className="text-sm text-light-gray">
//               {template.content}
//             </div> */}
//             <div
//               className="text-sm text-light-gray line-clamp"
//               dangerouslySetInnerHTML={{
//                 __html: template.content ? template.content.replace(/\n/g, '<br/>') : ''
//               }}
//             ></div>
//           </div>
//         </div>
//       </DialogTrigger>
//       <DialogContent small={true} onOpenAutoFocus={(e) => e.preventDefault()}>
//         <DialogHeader>
//           <DialogTitle className="font-elmessiri text-2xl font-bold capitalize">
//             {template.title}
//           </DialogTitle>
//           <DialogDescription>
//             <span className="font-pjs text-[1rem] leading-6 text-light-gray"
//               dangerouslySetInnerHTML={{
//                 __html: template.content ? template.content.replace(/\n/g, '<br/>') : ''
//               }}
//             >
//             </span>
//             {/* <span className="font-pjs text-[1rem] leading-6 text-light-gray">
//               {template.content}
//             </span> */}
//           </DialogDescription>
//         </DialogHeader>
//       </DialogContent>
//     </Dialog>
//   );
// };

export default SocialTextTemplate;

const TemplateLiked = ({
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
    api.socialText.likeSocialTextTemplate.useMutation();

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

  const updateTextCategories = (newState: boolean) => {
    const categories = ["STORY_IDEAS", "REELS_IDEAS"] as SocialTextCategory[];
    categories.forEach((category: SocialTextCategory) => {
      trpc.socialText.getRecentTextTemplates.setData(
        {
          category: category,
          take: 4,
        },
        (data) => {
          return data ? mapTemplateArray(data, newState) : undefined;
        },
      );
      trpc.socialText.getSocialTextTemplates.setData(
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
    const newState = !liked;
    setLikedPost(newState);
    try {
      const result = await likeTemplateMutation.mutateAsync({
        id,
        status: newState,
      });

      //If the "like" action was successful
      if (result) {
        updateTextCategories(newState);

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

            toast.success(!likedPost && "Added to favourites", {
              autoClose: 2000,
            });

            return data?.templates
              ? {
                total: data?.total ?? 0,
                templates: newFavouriteTemplates,
              }
              : undefined;
          },
        );
      }
    } catch (e) {
      //If the "like" action failed on server
      setLikedPost(!newState);
      toast.error("Failed to like template");
    }
  };

  return (
    <div
      className={`flex h-8 w-8 items-center justify-center rounded-xl bg-secondary transition-transform hover:scale-125 hover:cursor-pointer ${likeTemplateMutation.isLoading ? "" : "hover:cursor-pointer"}`}
      onClick={(e) => {
        e.stopPropagation();
        likeTemplateToggle();
      }}
    >
      {likedPost ? (
        <svg
          width="13"
          height="12"
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
          width="13"
          height="12"
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
