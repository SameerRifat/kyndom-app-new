"use client";
import MonthsFilter from "@/app/_components/dashboard/filters/months-filter";
import NoResults from "@/app/_components/dashboard/filters/no-results";
import SearchResult from "@/app/_components/dashboard/filters/search-result";
import TagsFilter from "@/app/_components/dashboard/filters/tags-filter";
import ContentPageLoading from "@/app/_components/dashboard/general/content-page-loading";
import ContentHeader from "@/app/_components/dashboard/social-content/content-header";
import TextItems from "@/app/_components/dashboard/social-text/text-items";
import { Template } from "@/lib/schemas/generic";
import { SortBy } from "@/lib/types/content-vault";
import { api } from "@/trpc/react";
import { SocialTemplateTag, SocialTextCategory } from "@prisma/client";
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const SocialTextCategoryPage = ({
  params,
}: {
  params: { category: string };
}) => {
  const { ref, inView } = useInView();
  const vaultItemsPerPage = 24;

  const [vaultItems, setVaultItems] = useState<Template[]>([]);
  const [vaultTotalResults, setVaultTotalResults] = useState<number>(0);
  const [vaultPage, setVaultPage] = useState<number>(0);

  const [filterTags, setFilterTags] = useState<SocialTemplateTag[]>([]);
  const [filterMonths, setFilterMonths] = useState<string[]>([]);

  const [sortBy, setSortBy] = useState<SortBy>("newest");

  const searchTemplates = api.socialText.getSocialTextTemplates.useQuery(
    {
      filter_tags:
        filterTags.length > 0 ? filterTags.map((t) => t.id) : undefined,
      filter_category: [params.category.toUpperCase() as SocialTextCategory],
      filter_months: filterMonths.length > 0 ? filterMonths : undefined,
      sort_by: sortBy,
      skip: vaultPage * vaultItemsPerPage,
      take: vaultItemsPerPage,
    },
    {
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
    },
  );

  useEffect(() => {
    setVaultPage(0);
    setVaultItems([]);
    setVaultTotalResults(0)
  }, [filterTags, , params.category, filterMonths, sortBy]);

  // useEffect(() => {
  //   if (!searchTemplates.data?.templates) return;
  //   setVaultTotalResults(searchTemplates.data.total);
  //   setVaultItems(searchTemplates.data.templates);
  // }, [searchTemplates.data]);

  // useEffect(() => {
  //   if (!searchTemplates.data?.templates) return;

  //   setVaultTotalResults(searchTemplates.data.total);

  //   // Check if fetched data already exists in calendarItems
  //   const existingIds = new Set(vaultItems.map(item => item.id));
  //   const newTemplates = searchTemplates.data.templates.filter(template => !existingIds.has(template.id));

  //   setVaultItems((prevItems) =>
  //     vaultPage === 0 ? searchTemplates.data.templates : [...prevItems, ...newTemplates]
  //   );
  // }, [searchTemplates.data, vaultPage]);

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

  useEffect(() => {
    if (inView && searchTemplates.fetchStatus !== "fetching" && vaultItems.length < vaultTotalResults) {
      setVaultPage((prevPage) => prevPage + 1);
    }
  }, [inView, searchTemplates.fetchStatus, vaultItems.length, vaultTotalResults]);

  const clearSearch = () => {
    setFilterTags([]);
    setFilterMonths([]);
    setVaultItems([]);
    setVaultPage(0);
    searchTemplates.refetch();
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
    <div className="flex flex-col gap-y-6 mb-5">
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
        clearSearch={
          filterTags.length > 0 || filterMonths.length > 0
            ? clearSearch
            : undefined
        }
        fetchedItems={vaultItems.length}
      />
      {/* {searchTemplates.fetchStatus !== "fetching" ? (
        <div>
          {!(vaultItems.length > 0) && <NoResults />}
          <TextItems textTemplates={vaultItems} />
        </div>
      ) : (
        <ContentPageLoading />
      )} */}

      {vaultItems.length === 0 && searchTemplates.fetchStatus === "fetching" ? (
        <ContentPageLoading />
      ) : (
        <>
          {vaultItems.length > 0 ? (
            <TextItems textTemplates={vaultItems} />
          ) : (
            <NoResults />
          )}
          {vaultItems.length < vaultTotalResults && searchTemplates.fetchStatus === "fetching" && (
            <div className="flex h-10 w-full items-center justify-center mt-5">
              <div className="animate-spin">
                <Loader2Icon className="text-primary" size={32} />
              </div>
            </div>
          )}
          {vaultItems.length < vaultTotalResults && searchTemplates.fetchStatus !== "fetching" && (<div ref={ref} />)}
        </>
      )}
    </div>
  );
};

export default SocialTextCategoryPage;
