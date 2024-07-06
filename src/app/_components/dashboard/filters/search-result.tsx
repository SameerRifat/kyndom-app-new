import FilterControls from "@/app/_components/dashboard/filters/filter-controls";
import SearchSortBy from "@/app/_components/dashboard/filters/sort-by";
import { Button } from "@/components/ui/button";
import { SortBy } from "@/lib/types/content-vault";
import {
  SocialContentCategory,
  SocialTemplateTag,
  SocialTextCategory,
} from "@prisma/client";
import { FilterIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import autoAnimate from "@formkit/auto-animate";
const SearchResult = ({
  filtersContent,
  totalResults,
  itemsPerPage,
  filterText,
  filterTags,
  setFilterTags,
  filterContentCategories,
  setFilterContentCategories,
  filterTextCategories,
  setFilterTextCategories,
  filterMonths,
  setFilterMonths,
  sortBy,
  setSortBy,
  clearSearch,
  fetchedItems,
}: {
  filtersContent: React.ReactNode;
  totalResults: number;
  itemsPerPage: number;
  filterText?: string;
  filterTags: SocialTemplateTag[];
  setFilterTags: (state: SocialTemplateTag[]) => void;
  filterContentCategories?: SocialContentCategory[];
  setFilterContentCategories?: (state: SocialContentCategory[]) => void;
  filterTextCategories?: SocialTextCategory[];
  setFilterTextCategories?: (state: SocialTextCategory[]) => void;
  filterMonths: string[];
  setFilterMonths: (state: string[]) => void;
  sortBy: SortBy;
  setSortBy: (state: SortBy) => void;
  clearSearch?: () => void;
  fetchedItems?: number
}) => {
  const [vaultToggleFilters, setVaultToggleFilters] = useState<boolean>(false);
  const parent = useRef(null);
  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);
  return (
    <div className="flex flex-col">
      <div ref={parent} className="flex flex-col gap-y-4">
        <div
          className={`flex items-center ${!filterText ? "w-full justify-end" : "justify-between"}`}
        >
          {/* input search bar */}
          {filterText && (
            <div className="flex flex-col gap-y-1 font-plusjakartasans">
              <div className="text-sm">Search results for</div>
              <div className="text-lg font-semibold capitalize text-[#303134]">
                {filterText}
              </div>
            </div>
          )}

          {/* filter buttons */}
          <div className="flex gap-x-2">
            <Button
              variant={"vaultFilter"}
              size={"vaultOption"}
              onClick={() => setVaultToggleFilters(!vaultToggleFilters)}
            >
              <FilterIcon className="text-primary" size={18} />
              <div className="hidden md:flex">Available Filters</div>
            </Button>
            <SearchSortBy sortBy={sortBy} setSortBy={setSortBy} />
          </div>
        </div>
        {vaultToggleFilters && (
          <div className="flex flex-col gap-y-4 md:flex-row md:gap-x-4">
            {filtersContent}
          </div>
        )}

        {/* filter select boxes */}
        <FilterControls
          filterTags={filterTags}
          setFilterTags={setFilterTags}
          filterContentCategories={filterContentCategories}
          setFilterContentCategories={setFilterContentCategories}
          filterTextCategories={filterTextCategories}
          setFilterTextCategories={setFilterTextCategories}
          filterMonths={filterMonths}
          setFilterMonths={setFilterMonths}
          clearSearch={clearSearch}
        />
      </div>
      <div className="flex">
        Viewing {fetchedItems} of{" "}
        {totalResults} results
      </div>
    </div>
  );
};

export default SearchResult;
