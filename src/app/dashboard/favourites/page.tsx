"use client";
import ContentTypeFilter from "@/app/_components/dashboard/filters/content-type-filter";
import MonthsFilter from "@/app/_components/dashboard/filters/months-filter";
import NoResults from "@/app/_components/dashboard/filters/no-results";
import SearchResult from "@/app/_components/dashboard/filters/search-result";
import TagsFilter from "@/app/_components/dashboard/filters/tags-filter";
import ContentPageLoading from "@/app/_components/dashboard/general/content-page-loading";
import FullPageRow from "@/app/_components/dashboard/general/full-page-row";
import ContentTemplate from "@/app/_components/dashboard/social-content/social-template";
import TextTemplate from "@/app/_components/dashboard/social-text/social-text-template";
import { Template } from "@/lib/schemas/generic";
import { SortBy } from "@/lib/types/content-vault";
import { api } from "@/trpc/react";
import {
  SocialContentCategory,
  SocialTemplateTag,
  SocialTextCategory,
} from "@prisma/client";
import { useEffect, useState } from "react";

const FavouritesPage = ({ params }: { params: { category: string } }) => {
  const vaultItemsPerPage = 25;

  const [vaultItems, setVaultItems] = useState<Template[]>([]);
  const [vaultTotalResults, setVaultTotalResults] = useState<number>(0);
  const [vaultPage, setVaultPage] = useState<number>(0);

  const [filterTags, setFilterTags] = useState<SocialTemplateTag[]>([]);
  const [filterContentCategories, setFilterContentCategories] = useState<
    SocialContentCategory[]
  >([]);
  const [filterTextCategories, setFilterTextCategories] = useState<
    SocialTextCategory[]
  >([]);
  const [filterMonths, setFilterMonths] = useState<string[]>([]);

  const [sortBy, setSortBy] = useState<SortBy>("newest");

  const favouriteTemplates = api.user.getFavouriteTemplates.useQuery(
    {
      filter_tags:
        filterTags.length > 0 ? filterTags.map((t) => t.id) : undefined,
      filter_category_social_content:
        filterContentCategories.length > 0
          ? filterContentCategories
          : undefined,
      filter_category_social_text:
        filterTextCategories.length > 0 ? filterTextCategories : undefined,
      filter_months: filterMonths.length > 0 ? filterMonths : undefined,
      sort_by: sortBy,
      skip: vaultPage * vaultItemsPerPage,
      take: vaultItemsPerPage,
    },
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  );

  useEffect(() => {
    if (!favouriteTemplates.data?.templates) return;
    setVaultTotalResults(favouriteTemplates.data.total);
    setVaultItems(favouriteTemplates.data.templates);
  }, [favouriteTemplates.data]);

  const clearSearch = () => {
    setFilterTags([]);
    setFilterContentCategories([]);
    setFilterTextCategories([]);
    setFilterMonths([]);
    setVaultItems([]);
  };

  const filtersContent = (
    <>
      <TagsFilter
        dropdown={true}
        filterTags={filterTags}
        setFilterTags={setFilterTags}
      />
      <ContentTypeFilter
        dropdown={true}
        filterContentCategories={filterContentCategories}
        setFilterContentCategories={setFilterContentCategories}
        filterTextCategories={filterTextCategories}
        setFilterTextCategories={setFilterTextCategories}
      />
      <MonthsFilter
        dropdown={true}
        filterMonths={filterMonths}
        setFilterMonths={setFilterMonths}
        popoverAlign="start"
        allignOffset={0}
      />
    </>
  );

  return (
    <div className="flex flex-col gap-y-6">
      <h1 className="py-6 font-elmessiri text-3xl capitalize leading-6">
        Favourites
      </h1>
      <SearchResult
        filtersContent={filtersContent}
        filterContentCategories={filterContentCategories}
        setFilterContentCategories={setFilterContentCategories}
        filterTextCategories={filterTextCategories}
        setFilterTextCategories={setFilterTextCategories}
        totalResults={vaultItems.length}
        itemsPerPage={vaultItemsPerPage}
        filterTags={filterTags}
        setFilterTags={setFilterTags}
        filterMonths={filterMonths}
        setFilterMonths={setFilterMonths}
        sortBy={sortBy}
        setSortBy={setSortBy}
        clearSearch={  
          filterTags.length > 0 || filterMonths.length > 0
            ? clearSearch
            : undefined
        }
        fetchedItems={vaultItems.length}
      />
      {favouriteTemplates.fetchStatus !== "fetching" ? (
        <FullPageRow>
          {!(vaultItems.length > 0) && <NoResults />}
          {vaultItems.map((socialTemplate, index) => {
            if (socialTemplate.type === "socialContent") {
              return (
                <ContentTemplate
                  template={socialTemplate}
                  content_vault={true}
                  key={`social-template-${socialTemplate.id}-${index}`}
                />
              );
            } else if (socialTemplate.type === "socialText") {
              return (
                <TextTemplate
                  template={socialTemplate}
                  content_vault={true}
                  key={`social-text-${socialTemplate.id}-${index}`}
                />
              );
            } else {
              return <></>;
            }
          })}
        </FullPageRow>
      ) : (
        <ContentPageLoading />
      )}
    </div>
  );
};

export default FavouritesPage;


// "use client";
// import ContentTypeFilter from "@/app/_components/dashboard/filters/content-type-filter";
// import MonthsFilter from "@/app/_components/dashboard/filters/months-filter";
// import NoResults from "@/app/_components/dashboard/filters/no-results";
// import SearchResult from "@/app/_components/dashboard/filters/search-result";
// import TagsFilter from "@/app/_components/dashboard/filters/tags-filter";
// import ContentPageLoading from "@/app/_components/dashboard/general/content-page-loading";
// import FullPageRow from "@/app/_components/dashboard/general/full-page-row";
// import ContentTemplate from "@/app/_components/dashboard/social-content/social-template";
// import TextTemplate from "@/app/_components/dashboard/social-text/social-text-template";
// import { Template } from "@/lib/schemas/generic";
// import { SortBy } from "@/lib/types/content-vault";
// import { api } from "@/trpc/react";
// import {
//   SocialContentCategory,
//   SocialTemplateTag,
//   SocialTextCategory,
// } from "@prisma/client";
// import { Loader2Icon } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useInView } from "react-intersection-observer";

// const FavouritesPage = ({ params }: { params: { category: string } }) => {
//   const vaultItemsPerPage = 12;
//   const { ref, inView } = useInView({ threshold: 0.5 });

//   const [initialSearched, setInitialSearched] = useState<boolean>(false);
//   const [vaultItems, setVaultItems] = useState<Template[]>([]);
//   const [vaultTotalResults, setVaultTotalResults] = useState<number>(0);
//   const [vaultPage, setVaultPage] = useState<number>(0);

//   const [filterTags, setFilterTags] = useState<SocialTemplateTag[]>([]);
//   const [filterContentCategories, setFilterContentCategories] = useState<
//     SocialContentCategory[]
//   >([]);
//   const [filterTextCategories, setFilterTextCategories] = useState<
//     SocialTextCategory[]
//   >([]);
//   const [filterMonths, setFilterMonths] = useState<string[]>([]);

//   const [sortBy, setSortBy] = useState<SortBy>("newest");

//   const favouriteTemplates = api.user.getFavouriteTemplates.useQuery(
//     {
//       filter_tags:
//         filterTags.length > 0 ? filterTags.map((t) => t.id) : undefined,
//       filter_category_social_content:
//         filterContentCategories.length > 0
//           ? filterContentCategories
//           : undefined,
//       filter_category_social_text:
//         filterTextCategories.length > 0 ? filterTextCategories : undefined,
//       filter_months: filterMonths.length > 0 ? filterMonths : undefined,
//       sort_by: sortBy,
//       skip: vaultPage * vaultItemsPerPage,
//       take: vaultItemsPerPage,
//     },
//     {
//       refetchOnMount: true,
//       refetchOnReconnect: true,
//       refetchOnWindowFocus: true,
//     },
//   );

//   // useEffect(() => {
//   //   setVaultPage(0);
//   //   setVaultItems([]);
//   //   setVaultTotalResults(0);
//   // }, [filterTags, filterContentCategories, filterTextCategories, filterMonths, sortBy]);

//   // useEffect(() => {
//   //   if (!favouriteTemplates.data?.templates) return;

//   //   setVaultTotalResults(favouriteTemplates.data.total);

//   //   if (vaultPage === 0) {
//   //     setVaultItems(favouriteTemplates.data.templates);
//   //   } else {
//   //     const existingIds = new Set(vaultItems.map(item => item.id));
//   //     const newTemplates = favouriteTemplates.data.templates.filter(template => !existingIds.has(template.id));
//   //     setVaultItems(prevItems => [...prevItems, ...newTemplates]);
//   //   }
//   // }, [favouriteTemplates.data]);
//   useEffect(() => {
//     if (!favouriteTemplates.data?.templates) return;

//     setVaultTotalResults(favouriteTemplates.data.total);

//     if (vaultPage === 0) {
//       setVaultItems(favouriteTemplates.data.templates);
//     } else {
//       const existingItems = new Map(vaultItems.map(item => [item.id, item]));
//       const newTemplates = favouriteTemplates.data.templates.filter(template => {
//         const existingItem = existingItems.get(template.id);
//         return !existingItem || template.liked !== existingItem.liked;
//       });

//       // Update the vaultItems with the new templates
//       setVaultItems(prevItems => {
//         const updatedItems = prevItems.map(item => {
//           const newItem = newTemplates.find(template => template.id === item.id);
//           return newItem ? newItem : item;
//         });
//         return [...updatedItems, ...newTemplates.filter(template => !existingItems.has(template.id))];
//       });
//     }
//   }, [favouriteTemplates.data, vaultPage]);
//   console.log('favouriteTemplates.data: ', favouriteTemplates.data)

//   // useEffect(() => {
//   //   if (!favouriteTemplates.data?.templates) return;
//   //   setVaultTotalResults(favouriteTemplates.data.total);
//   //   setVaultItems(favouriteTemplates.data.templates);
//   // }, [favouriteTemplates.data]);

//   useEffect(() => {
//     if (inView && favouriteTemplates.fetchStatus !== 'fetching' && vaultItems.length < vaultTotalResults) {
//       setVaultPage(prevPage => prevPage + 1);
//     }
//   }, [inView, favouriteTemplates.fetchStatus, vaultItems.length, vaultTotalResults]);

//   const clearSearch = () => {
//     setFilterTags([]);
//     setFilterContentCategories([]);
//     setFilterTextCategories([]);
//     setFilterMonths([]);
//     setVaultItems([]);
//     setVaultPage(0)
//     favouriteTemplates.refetch();
//   };

//   const filtersContent = (
//     <>
//       <TagsFilter
//         dropdown={true}
//         filterTags={filterTags}
//         setFilterTags={setFilterTags}
//       />
//       <ContentTypeFilter
//         dropdown={true}
//         filterContentCategories={filterContentCategories}
//         setFilterContentCategories={setFilterContentCategories}
//         filterTextCategories={filterTextCategories}
//         setFilterTextCategories={setFilterTextCategories}
//       />
//       <MonthsFilter
//         dropdown={true}
//         filterMonths={filterMonths}
//         setFilterMonths={setFilterMonths}
//         popoverAlign="start"
//         allignOffset={0}
//       />
//     </>
//   );

//   return (
//     <div className="flex flex-col gap-y-6 pb-8">
//       <h1 className="py-6 font-elmessiri text-3xl capitalize leading-6">
//         Favourites
//       </h1>
//       <SearchResult
//         filtersContent={filtersContent}
//         filterContentCategories={filterContentCategories}
//         setFilterContentCategories={setFilterContentCategories}
//         filterTextCategories={filterTextCategories}
//         setFilterTextCategories={setFilterTextCategories}
//         totalResults={vaultTotalResults}
//         itemsPerPage={vaultItemsPerPage}
//         filterTags={filterTags}
//         setFilterTags={setFilterTags}
//         filterMonths={filterMonths}
//         setFilterMonths={setFilterMonths}
//         sortBy={sortBy}
//         setSortBy={setSortBy}
//         clearSearch={
//           filterTags.length > 0 || filterMonths.length > 0
//             ? clearSearch
//             : undefined
//         }
//         fetchedItems={vaultItems.length}
//       />
//       {vaultItems.length === 0 && favouriteTemplates.fetchStatus === 'fetching' ? (
//         <ContentPageLoading extraHeight={96} />
//       ) : (
//         <>
//           <FullPageRow>
//             {!(vaultItems.length > 0) && <NoResults />}
//             {vaultItems.map((socialTemplate, index) => {
//               if (socialTemplate.type === 'socialContent') {
//                 return (
//                   <ContentTemplate
//                     template={socialTemplate}
//                     content_vault={true}
//                     key={`social-template-${socialTemplate.id}-${index}`}
//                   />
//                 );
//               } else if (socialTemplate.type === 'socialText') {
//                 return (
//                   <TextTemplate
//                     template={socialTemplate}
//                     content_vault={true}
//                     key={`social-text-${socialTemplate.id}-${index}`}
//                   />
//                 );
//               } else {
//                 return null;
//               }
//             })}
//           </FullPageRow>
//           {vaultItems.length < vaultTotalResults && favouriteTemplates.fetchStatus === 'fetching' && (
//             <div className="flex h-10 w-full items-center justify-center mt-5">
//               <div className="animate-spin">
//                 <Loader2Icon className="text-primary" size={32} />
//               </div>
//             </div>
//           )}
//           {vaultItems.length < vaultTotalResults && favouriteTemplates.fetchStatus !== 'fetching' && (
//             <div ref={ref} />
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default FavouritesPage;