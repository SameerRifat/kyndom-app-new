"use client";
import MonthsFilter from "@/app/_components/dashboard/filters/months-filter";
import NoResults from "@/app/_components/dashboard/filters/no-results";
import SearchResult from "@/app/_components/dashboard/filters/search-result";
import TagsFilter from "@/app/_components/dashboard/filters/tags-filter";
import ContentPageLoading from "@/app/_components/dashboard/general/content-page-loading";
import ContentHeader from "@/app/_components/dashboard/social-content/content-header";
import ContentItems from "@/app/_components/dashboard/social-content/content-items";
import { Template } from "@/lib/schemas/generic";
import { SortBy } from "@/lib/types/content-vault";
import { api } from "@/trpc/react";
import { SocialContentCategory, SocialTemplateTag } from "@prisma/client";
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from 'react-intersection-observer';

const SocialContentCategoryPage = ({ params }: { params: { category: string } }) => {
  const { ref, inView } = useInView();
  const vaultItemsPerPage = 24;

  const [vaultItems, setVaultItems] = useState<Template[]>([]);
  const [vaultTotalResults, setVaultTotalResults] = useState<number>(0);
  const [vaultPage, setVaultPage] = useState<number>(0);

  const [filterTags, setFilterTags] = useState<SocialTemplateTag[]>([]);
  const [filterMonths, setFilterMonths] = useState<string[]>([]);

  const [sortBy, setSortBy] = useState<SortBy>("newest");

  const { data, fetchStatus, refetch } = api.socialContent.getSocialContentTemplates.useQuery(
    {
      filter_tags: filterTags.length > 0 ? filterTags.map((t) => t.id) : undefined,
      filter_category: [params.category.toUpperCase() as SocialContentCategory],
      filter_months: filterMonths.length > 0 ? filterMonths : undefined,
      sort_by: sortBy,
      skip: vaultPage * vaultItemsPerPage,
      take: vaultItemsPerPage,
    },
    {
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
    }
  );

  // Sort vault items based on sortBy state
  // useEffect(() => {
  //   const sortVaultItems = (items: Template[], sortBy: SortBy): Template[] => {
  //     switch (sortBy) {
  //       case 'newest':
  //         return items.slice().sort((a, b) => {
  //           if (a.createdAt && b.createdAt) {
  //             return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  //           }
  //           return 0;
  //         });
  //       case 'oldest':
  //         return items.slice().sort((a, b) => {
  //           if (a.createdAt && b.createdAt) {
  //             return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  //           }
  //           return 0;
  //         });
  //       // Add other sorting options here
  //       default:
  //         return items;
  //     }
  //   };
  //   setVaultItems(prevItems => sortVaultItems(prevItems, sortBy));
  // }, [sortBy]);

  useEffect(() => {
    setVaultPage(0);
    setVaultItems([]);
    setVaultTotalResults(0)
  }, [filterTags, , params.category, filterMonths, sortBy]);

  // useEffect(() => {
  //   if (!data?.templates) return;

  //   setVaultTotalResults(data.total);

  //   // Check if fetched data already exists in calendarItems
  //   const existingIds = new Set(vaultItems.map(item => item.id));
  //   const newTemplates = data.templates.filter(template => !existingIds.has(template.id));

  //   setVaultItems((prevItems) =>
  //     vaultPage === 0 ? data.templates : [...prevItems, ...newTemplates]
  //   );
  // }, [data, vaultPage]);

  useEffect(() => {
    if (!data?.templates) return;

    setVaultTotalResults(data.total);

    if (vaultPage === 0) {
      setVaultItems(data.templates);
    } else {
      const existingItems = new Map(vaultItems.map(item => [item.id, item]));
      const newTemplates = data.templates.filter(template => {
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
  }, [data, vaultPage]);


  // useEffect(() => {
  //   if (!data?.templates) return;
  //   // setInitialSearched(true);
  //   setVaultTotalResults(data.total);
  //   setVaultItems(data.templates);
  // }, [data, vaultPage]);

  useEffect(() => {
    if (inView && fetchStatus !== "fetching" && vaultItems.length < vaultTotalResults) {
      setVaultPage((prevPage) => prevPage + 1);
    }
  }, [inView, fetchStatus, vaultItems.length, vaultTotalResults]);

  const clearSearch = () => {
    setFilterTags([]);
    setFilterMonths([]);
    setVaultItems([]);
    setVaultPage(0);
    refetch();
  };

  const filtersContent = (
    <>
      <TagsFilter
        dropdown={true}
        filterTags={filterTags}
        setFilterTags={setFilterTags}
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
    <div className="flex flex-col gap-y-6 pb-8">
      <ContentHeader category={params.category} />
      <SearchResult
        filtersContent={filtersContent}
        totalResults={vaultTotalResults}
        itemsPerPage={vaultItemsPerPage}
        filterTags={filterTags}
        setFilterTags={setFilterTags}
        filterMonths={filterMonths}
        setFilterMonths={setFilterMonths}
        sortBy={sortBy}
        setSortBy={setSortBy}
        clearSearch={filterTags.length > 0 || filterMonths.length > 0 ? clearSearch : undefined}
        fetchedItems={vaultItems.length}
      />
      {vaultItems.length === 0 && fetchStatus === "fetching" ? (
        <ContentPageLoading extraHeight={96} />
      ) : (
        <>
          {vaultItems.length > 0 ? (
            <ContentItems contentTemplates={vaultItems} />
          ) : (
            <NoResults />
          )}
          {vaultItems.length < vaultTotalResults && fetchStatus === "fetching" && (
            <div className="flex h-10 w-full items-center justify-center mt-5">
              <div className="animate-spin">
                <Loader2Icon className="text-primary" size={32} />
              </div>
            </div>
          )}
          {vaultItems.length < vaultTotalResults && fetchStatus !== "fetching" && (<div ref={ref} />)}
        </>
      )}
    </div>
  );
};

export default SocialContentCategoryPage;