"use client";
import ContentVaultTypeFilter from "@/app/_components/dashboard/filters/content-type-filter";
import ContentVaultMonthsFilter from "@/app/_components/dashboard/filters/months-filter";
import NoResults from "@/app/_components/dashboard/filters/no-results";
import SearchResult from "@/app/_components/dashboard/filters/search-result";
import ContentVaultTagsFilter from "@/app/_components/dashboard/filters/tags-filter";
import ContentPageLoading from "@/app/_components/dashboard/general/content-page-loading";
import FullPageRow from "@/app/_components/dashboard/general/full-page-row";
import TemplateSearch from "@/app/_components/dashboard/general/template-search";
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
import VaultLoading from "./vault-loading";
import { useInView } from "react-intersection-observer";
import { Loader2Icon } from "lucide-react";

const VaultItems = () => {
  const vaultItemsPerPage = 12;
  const { ref, inView } = useInView({ threshold: 0.5 });

  const [initialSearched, setInitialSearched] = useState<boolean>(false);
  const [vaultItems, setVaultItems] = useState<Template[]>([]);
  const [vaultTotalResults, setVaultTotalResults] = useState<number>(0);
  const [vaultPage, setVaultPage] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>('');
  const [filterText, setFilterText] = useState<string>('');
  const [filterTags, setFilterTags] = useState<SocialTemplateTag[]>([]);
  const [filterContentCategories, setFilterContentCategories] = useState<SocialContentCategory[]>([]);
  const [filterTextCategories, setFilterTextCategories] = useState<SocialTextCategory[]>([]);
  const [filterMonths, setFilterMonths] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>('newest');

  const searchTemplates = api.contentVault.search.useQuery(
    {
      filter_title: searchText,
      filter_tags: filterTags.length > 0 ? filterTags.map(t => t.id) : undefined,
      filter_category_social_content: filterContentCategories.length > 0 ? filterContentCategories : undefined,
      filter_category_social_text: filterTextCategories.length > 0 ? filterTextCategories : undefined,
      filter_months: filterMonths.length > 0 ? filterMonths : undefined,
      sort_by: sortBy,
      skip: vaultPage * vaultItemsPerPage,
      take: vaultItemsPerPage,
    },
    {
      enabled: initialSearched,
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
    }
  );

  // Clear search state on mount
  useEffect(() => {
    setSearchText('');
    setVaultPage(0);
    setVaultItems([]);
    setVaultTotalResults(0);
    setInitialSearched(false);
  }, []);

  // Clear search state on filter changes
  useEffect(() => {
    setVaultPage(0);
    setVaultItems([]);
    setVaultTotalResults(0);
  }, [filterTags, filterContentCategories, filterTextCategories, filterMonths, sortBy]);

  // Update vault items when search results change
  useEffect(() => {
    if (!searchTemplates.data?.templates) return;

    setVaultTotalResults(searchTemplates.data.total);

    if (vaultPage === 0) {
      setVaultItems(searchTemplates.data.templates);
    } else {
      const existingItems = new Map(vaultItems.map(item => [item.id, item]));
      const newTemplates = searchTemplates.data.templates.filter(template => {
        const existingItem = existingItems.get(template.id);
        return !existingItem || template.liked !== existingItem.liked;
      });

      // Update the vaultItems with the new templates
      setVaultItems(prevItems => {
        const updatedItems = prevItems.map(item => {
          const newItem = newTemplates.find(template => template.id === item.id);
          return newItem ? newItem : item;
        });
        return [...updatedItems, ...newTemplates.filter(template => !existingItems.has(template.id))];
      });
    }
  }, [searchTemplates.data, vaultPage]);

  // Handle infinite scroll
  useEffect(() => {
    if (inView && searchTemplates.fetchStatus !== 'fetching' && vaultItems.length < vaultTotalResults) {
      setVaultPage(prevPage => prevPage + 1);
    }
  }, [inView, searchTemplates.fetchStatus, vaultItems.length, vaultTotalResults]);

  // Handle search action
  const onSearch = () => {
    setSearchText(filterText);
    setVaultPage(0);
    setVaultItems([]);
    setInitialSearched(true);
    searchTemplates.refetch();
  };

  // Handle clear search action
  const clearSearch = () => {
    setFilterTags([]);
    setFilterContentCategories([]);
    setFilterTextCategories([]);
    setFilterMonths([]);
    setVaultItems([]);
    setVaultPage(0);
    // setInitialSearched(false);
    // setSearchText('');
    setFilterText('');
  };


  const filtersContent = (
    <>
      <ContentVaultTagsFilter filterTags={filterTags} setFilterTags={setFilterTags} dropdown={true} />
      <ContentVaultTypeFilter
        filterContentCategories={filterContentCategories}
        setFilterContentCategories={setFilterContentCategories}
        filterTextCategories={filterTextCategories}
        setFilterTextCategories={setFilterTextCategories}
        dropdown={true}
      />
      <ContentVaultMonthsFilter filterMonths={filterMonths} setFilterMonths={setFilterMonths} dropdown={true} />
    </>
  );

  return (
    <div className="flex flex-col gap-y-8 pb-8">
      <div className="flex flex-col gap-y-12">
        <div className="flex flex-col items-center justify-center gap-y-12">
          {!initialSearched && (
            <div className="flex flex-col gap-y-4 text-center">
              <h1 className="text-2xl font-semibold text-primary md:text-3xl">What are you looking for?</h1>
              <div className="text-sm font-medium text-orange md:text-base">Search through Kyndom Cloud</div>
            </div>
          )}
          <TemplateSearch
            loading={searchTemplates.isFetching}
            defaultValue={filterText}
            onChange={v => setFilterText(v)}
            placeholder="Search for templates, reels, caption or anything"
            onSearch={onSearch}
          />
        </div>
        {initialSearched && (
          <SearchResult
            filtersContent={filtersContent}
            totalResults={vaultTotalResults}
            itemsPerPage={vaultItemsPerPage}
            filterText={searchText}
            filterTags={filterTags}
            setFilterTags={setFilterTags}
            filterContentCategories={filterContentCategories}
            setFilterContentCategories={setFilterContentCategories}
            filterTextCategories={filterTextCategories}
            setFilterTextCategories={setFilterTextCategories}
            filterMonths={filterMonths}
            setFilterMonths={setFilterMonths}
            sortBy={sortBy}
            setSortBy={setSortBy}
            clearSearch={clearSearch}
            fetchedItems={vaultItems.length}
          />
        )}
      </div>
      {initialSearched && (
        vaultItems.length === 0 && searchTemplates.fetchStatus === 'fetching' ? (
          <ContentPageLoading extraHeight={96} />
        ) : (
          <>
            <FullPageRow>
              {initialSearched && vaultItems.length > 0 ? (
                vaultItems.map((socialTemplate, index) => {
                  if (socialTemplate.type === 'socialContent') {
                    return (
                      <ContentTemplate
                        template={socialTemplate}
                        content_vault={true}
                        key={`social-template-${socialTemplate.id}-${index}`}
                      />
                    );
                  } else if (socialTemplate.type === 'socialText') {
                    return (
                      <TextTemplate
                        template={socialTemplate}
                        content_vault={true}
                        key={`social-text-${socialTemplate.id}-${index}`}
                      />
                    );
                  } else {
                    return null;
                  }
                })
              ) : (
                <NoResults />
              )}
            </FullPageRow>
            {vaultItems.length < vaultTotalResults && searchTemplates.fetchStatus === 'fetching' && (
              <div className="flex h-10 w-full items-center justify-center mt-5">
                <div className="animate-spin">
                  <Loader2Icon className="text-primary" size={32} />
                </div>
              </div>
            )}
            {vaultItems.length < vaultTotalResults && searchTemplates.fetchStatus !== 'fetching' && (
              <div ref={ref} />
            )}
          </>
        )
      )}
    </div>
  );
};


export default VaultItems;


// "use client";
// import ContentVaultTypeFilter from "@/app/_components/dashboard/filters/content-type-filter";
// import ContentVaultMonthsFilter from "@/app/_components/dashboard/filters/months-filter";
// import NoResults from "@/app/_components/dashboard/filters/no-results";
// import SearchResult from "@/app/_components/dashboard/filters/search-result";
// import ContentVaultTagsFilter from "@/app/_components/dashboard/filters/tags-filter";
// import ContentPageLoading from "@/app/_components/dashboard/general/content-page-loading";
// import FullPageRow from "@/app/_components/dashboard/general/full-page-row";
// import TemplateSearch from "@/app/_components/dashboard/general/template-search";
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
// import { useEffect, useState } from "react";
// import VaultLoading from "./vault-loading";
// import { useInView } from "react-intersection-observer";
// import { Loader2Icon } from "lucide-react";

// const VaultItems = () => {
//   const vaultItemsPerPage = 12;
//   const { ref, inView } = useInView({ threshold: 0.5 });

//   const [initialSearched, setInitialSearched] = useState<boolean>(false);
//   // const [lastSearchText, setLastSearchText] = useState<string>('');
//   const [vaultItems, setVaultItems] = useState<Template[]>([]);
//   const [vaultTotalResults, setVaultTotalResults] = useState<number>(0);
//   const [vaultPage, setVaultPage] = useState<number>(0);
//   const [searchText, setSearchText] = useState<string>('');
//   const [filterText, setFilterText] = useState<string>('');
//   const [filterTags, setFilterTags] = useState<SocialTemplateTag[]>([]);
//   const [filterContentCategories, setFilterContentCategories] = useState<SocialContentCategory[]>([]);
//   const [filterTextCategories, setFilterTextCategories] = useState<SocialTextCategory[]>([]);
//   const [filterMonths, setFilterMonths] = useState<string[]>([]);
//   const [sortBy, setSortBy] = useState<SortBy>('newest');

//   const searchTemplates = api.contentVault.search.useQuery(
//     {
//       filter_title: searchText,
//       filter_tags: filterTags.length > 0 ? filterTags.map(t => t.id) : undefined,
//       filter_category_social_content: filterContentCategories.length > 0 ? filterContentCategories : undefined,
//       filter_category_social_text: filterTextCategories.length > 0 ? filterTextCategories : undefined,
//       filter_months: filterMonths.length > 0 ? filterMonths : undefined,
//       sort_by: sortBy,
//       skip: vaultPage * vaultItemsPerPage,
//       take: vaultItemsPerPage,
//     },
//     {
//       enabled: initialSearched,
//       refetchOnMount: true,
//       refetchOnReconnect: true,
//       refetchOnWindowFocus: true,
//     }
//   );

//   useEffect(() => {
//     setSearchText('')
//     setVaultPage(0);
//     setVaultItems([]);
//     setVaultTotalResults(0);
//     setInitialSearched(false)
//   }, []);
//   useEffect(() => {
//     setVaultPage(0);
//     setVaultItems([]);
//     setVaultTotalResults(0);
//   }, [filterTags, filterContentCategories, filterTextCategories, filterMonths, sortBy]);

//   useEffect(() => {
//     if (!searchTemplates.data?.templates) return;

//     setVaultTotalResults(searchTemplates.data.total);

//     if (vaultPage === 0) {
//       setVaultItems(searchTemplates.data.templates);
//     } else {
//       const existingItems = new Map(vaultItems.map(item => [item.id, item]));
//       const newTemplates = searchTemplates.data.templates.filter(template => {
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
//   }, [searchTemplates.data, vaultPage]);

//   // useEffect(() => {
//   //   if (!searchTemplates.data?.templates) return;

//   //   setVaultTotalResults(searchTemplates.data.total);

//   //   if (vaultPage === 0) {
//   //     setVaultItems(searchTemplates.data.templates);
//   //   } else {
//   //     const existingIds = new Set(vaultItems.map(item => item.id));
//   //     const newTemplates = searchTemplates.data.templates.filter(template => !existingIds.has(template.id));
//   //     setVaultItems(prevItems => [...prevItems, ...newTemplates]);
//   //   }
//   // }, [searchTemplates.data]);

//   // useEffect(() => {
//   //   if (!searchTemplates.data?.templates) return;
//   //   setInitialSearched(true);
//   //   setVaultTotalResults(searchTemplates.data.total);
//   //   setVaultItems(searchTemplates.data.templates);
//   // }, [searchTemplates.data]);

//   useEffect(() => {
//     if (inView && searchTemplates.fetchStatus !== 'fetching' && vaultItems.length < vaultTotalResults) {
//       setVaultPage(prevPage => prevPage + 1);
//     }
//   }, [inView, searchTemplates.fetchStatus, vaultItems.length, vaultTotalResults]);

//   const onSearch = () => {
//     // setLastSearchText(filterText);
//     setSearchText(filterText);
//     setVaultPage(0);
//     setVaultItems([]);
//     setInitialSearched(true);
//     searchTemplates.refetch();
//   };

//   const clearSearch = () => {
//     setFilterTags([]);
//     setFilterContentCategories([]);
//     setFilterTextCategories([]);
//     setFilterMonths([]);
//     setVaultItems([]);
//     setVaultPage(0);
//     setInitialSearched(false);
//     searchTemplates.refetch();
//   };

//   console.log('vaultItems: ', vaultItems)

//   const filtersContent = (
//     <>
//       <ContentVaultTagsFilter filterTags={filterTags} setFilterTags={setFilterTags} dropdown={true} />
//       <ContentVaultTypeFilter
//         filterContentCategories={filterContentCategories}
//         setFilterContentCategories={setFilterContentCategories}
//         filterTextCategories={filterTextCategories}
//         setFilterTextCategories={setFilterTextCategories}
//         dropdown={true}
//       />
//       <ContentVaultMonthsFilter filterMonths={filterMonths} setFilterMonths={setFilterMonths} dropdown={true} />
//     </>
//   );

//   return (
//     <div className="flex flex-col gap-y-8 pb-8">
//       <div className="flex flex-col gap-y-12">
//         <div className="flex flex-col items-center justify-center gap-y-12">
//           {!(vaultItems.length > 0) && (
//             <div className="flex flex-col gap-y-4 text-center">
//               <h1 className="text-2xl font-semibold text-primary md:text-3xl">What are you looking for?</h1>
//               <div className="text-sm font-medium text-orange md:text-base">Search through Kyndom Cloud</div>
//             </div>
//           )}
//           <TemplateSearch
//             loading={searchTemplates.isFetching}
//             defaultValue={filterText}
//             onChange={v => setFilterText(v)}
//             placeholder="Search for templates, reels, caption or anything"
//             onSearch={onSearch}
//           />
//         </div>
//         {initialSearched && (
//           <SearchResult
//             filtersContent={filtersContent}
//             totalResults={vaultTotalResults}
//             itemsPerPage={vaultItemsPerPage}
//             filterText={searchText}
//             filterTags={filterTags}
//             setFilterTags={setFilterTags}
//             filterContentCategories={filterContentCategories}
//             setFilterContentCategories={setFilterContentCategories}
//             filterTextCategories={filterTextCategories}
//             setFilterTextCategories={setFilterTextCategories}
//             filterMonths={filterMonths}
//             setFilterMonths={setFilterMonths}
//             sortBy={sortBy}
//             setSortBy={setSortBy}
//             clearSearch={clearSearch}
//             fetchedItems={vaultItems.length}
//           />
//         )}
//       </div>
//       {vaultItems.length === 0 && searchTemplates.fetchStatus === 'fetching' ? (
//         <ContentPageLoading extraHeight={96} />
//       ) : (
//         <>
//           <FullPageRow>
//             {/* {initialSearched && !(vaultItems.length > 0) && <NoResults />} */}
//             {vaultItems.length > 0 ? (vaultItems.map((socialTemplate, index) => {
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
//             })): (
//               initialSearched && <NoResults />
//             )}
//           </FullPageRow>
//           {vaultItems.length < vaultTotalResults && searchTemplates.fetchStatus === 'fetching' && (
//             <div className="flex h-10 w-full items-center justify-center mt-5">
//               <div className="animate-spin">
//                 <Loader2Icon className="text-primary" size={32} />
//               </div>
//             </div>
//           )}
//           {vaultItems.length < vaultTotalResults && searchTemplates.fetchStatus !== 'fetching' && (
//             <div ref={ref} />
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default VaultItems;