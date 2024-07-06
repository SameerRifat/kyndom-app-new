import { Button } from "@/components/ui/button";
import { readableEnum } from "@/lib/utils";
import autoAnimate from "@formkit/auto-animate";
import {
  SocialContentCategory,
  SocialTemplateTag,
  SocialTextCategory,
} from "@prisma/client";
import { Trash2, XIcon } from "lucide-react";
import { useEffect, useRef } from "react";

const FilterControls = ({
  filterTags,
  setFilterTags,
  filterContentCategories,
  setFilterContentCategories,
  filterTextCategories,
  setFilterTextCategories,
  filterMonths,
  setFilterMonths,
  clearSearch,
}: {
  filterTags: SocialTemplateTag[];
  setFilterTags: (state: SocialTemplateTag[]) => void;
  filterContentCategories?: SocialContentCategory[];
  setFilterContentCategories?: (state: SocialContentCategory[]) => void;
  filterTextCategories?: SocialTextCategory[];
  setFilterTextCategories?: (state: SocialTextCategory[]) => void;
  filterMonths?: string[];
  setFilterMonths?: (state: string[]) => void;
  clearSearch?: () => void;
}) => {
  const parent = useRef(null);
  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  const hasFiltersSelected =
    filterTags.length > 0 ||
    (filterContentCategories && filterContentCategories.length > 0) ||
    (filterTextCategories && filterTextCategories.length > 0) ||
    (filterMonths && filterMonths.length > 0);

  return (
    <>
      <div ref={parent} className="mt-6 flex flex-wrap gap-3">
        {filterTags.map((tag) => (
          <FilterOption
            content={tag.name}
            onRemove={() => setFilterTags(filterTags.filter((t) => t !== tag))}
            key={`result-tags-${tag}`}
          />
        ))}
        {filterContentCategories && setFilterContentCategories && (
          <>
            {filterContentCategories.map((category) => (
              <FilterOption
                content={readableEnum(category)}
                onRemove={() =>
                  setFilterContentCategories(
                    filterContentCategories.filter((c) => c !== category),
                  )
                }
                key={`result-content-category-${category}`}
              />
            ))}
          </>
        )}
        {filterTextCategories && setFilterTextCategories && (
          <>
            {filterTextCategories.map((category) => (
              <FilterOption
                content={readableEnum(category)}
                onRemove={() =>
                  setFilterTextCategories(
                    filterTextCategories.filter((c) => c !== category),
                  )
                }
                key={`result-text-category-${category}`}
              />
            ))}
          </>
        )}
        {filterMonths && filterMonths.map((month) => (
          <FilterOption
            content={month}
            onRemove={() =>
              setFilterMonths && setFilterMonths(filterMonths.filter((m) => m !== month))
            }
            key={`result-month-${month}`}
          />
        ))}
      </div>
      {hasFiltersSelected && clearSearch && (
        <Button
          variant={"ghost"}
          className="rounded-xl text-sm w-fit text-red-500"
          onClick={() => clearSearch()}
        >
          <div>Clear Search</div>
          <div>
            <Trash2 size={20} />
          </div>
        </Button>
      )}
    </>
  );
};

const FilterOption = ({
  content,
  onRemove,
}: {
  content: string;
  onRemove: () => void;
}) => {
  return (
    <Button className="rounded-2xl text-sm font-light" variant={"secondary"}>
      <span>{content}</span>
      <div onClick={() => onRemove()}>
        <XIcon size={20} />
      </div>
    </Button>
  );
};

export default FilterControls;
