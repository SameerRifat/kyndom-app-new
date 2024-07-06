import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SortBy } from "@/lib/types/content-vault";
import { readableEnum } from "@/lib/utils";
import { ListFilterIcon } from "lucide-react";

const SearchSortBy = ({
  sortBy,
  setSortBy,
}: {
  sortBy: SortBy;
  setSortBy: (state: SortBy) => void;
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"vaultFilter"} size={"vaultOption"}>
          <ListFilterIcon className="text-primary" size={18} />
          <div className="hidden md:flex">
            Sort By: {readableEnum(sortBy)} first
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-y-3 font-plusjakartasans">
          <div className="text-sm font-semibold">Sort By</div>
          <Button variant="secondary" onClick={() => setSortBy("oldest")}>
            Oldest to Newest
          </Button>
          <Button variant="secondary" onClick={() => setSortBy("newest")}>
            Newest to Oldest
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SearchSortBy;
