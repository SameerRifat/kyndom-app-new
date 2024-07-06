"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Combobox } from "@headlessui/react";
import { SocialContentCategory, SocialTextCategory } from "@prisma/client";
import { ChevronsUpDownIcon } from "lucide-react";
import { useState } from "react";
import { comboboxClassnames } from "./combobox";

const contentFilterOptions = [
  {
    value: SocialContentCategory.SOCIAL_MEDIA,
    label: "Social Media",
  },
  {
    value: SocialContentCategory.STORY_TEMPLATES,
    label: "Story Templates",
  },
  {
    value: SocialContentCategory.PRINTABLE,
    label: "Printable",
  },
  {
    value: SocialContentCategory.BRANDING,
    label: "Branding",
  },
  {
    value: SocialContentCategory.EMAIL,
    label: "Email",
  },
];

const textFilterOptions = [
  {
    value: SocialTextCategory.STORY_IDEAS,
    label: "Story Ideas",
  },
  {
    value: SocialTextCategory.REELS_IDEAS,
    label: "Reels Ideas",
  },
];

const ContentTypeFilter = ({
  dropdown,
  filterContentCategories,
  setFilterContentCategories,
  filterTextCategories,
  setFilterTextCategories,
}: {
  dropdown?: boolean;
  filterContentCategories?: SocialContentCategory[];
  setFilterContentCategories?: (state: SocialContentCategory[]) => void;
  filterTextCategories?: SocialTextCategory[];
  setFilterTextCategories?: (state: SocialTextCategory[]) => void;
}) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const filterIcon = (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.49504 0.125955C5.62819 0.0464051 5.77983 0.00307451 5.93491 0.000267683C6.08999 -0.00253914 6.2431 0.0352755 6.37904 0.109955C10.366 1.96196 12.623 5.80796 12.484 9.02396C12.424 10.375 11.941 11.626 11.004 12.539C10.066 13.453 8.71904 13.987 7.01404 13.99C6.32496 14.0326 5.6343 13.9372 4.98257 13.7094C4.33084 13.4816 3.73116 13.1259 3.2187 12.6633C2.70623 12.2006 2.2913 11.6403 1.99824 11.0152C1.70517 10.3901 1.53988 9.71279 1.51204 9.02295V9.01496C1.49168 8.21528 1.69072 7.4253 2.08754 6.73073C2.48436 6.03616 3.06382 5.46352 3.76304 5.07495C3.82378 5.04123 3.89088 5.02054 3.96007 5.0142C4.02925 5.00785 4.09899 5.016 4.16486 5.03811C4.23072 5.06022 4.29125 5.09581 4.34259 5.14262C4.39393 5.18942 4.43495 5.24641 4.46304 5.30996C4.70641 5.86193 5.04756 6.36536 5.47004 6.79596C5.96404 6.15096 6.19204 5.31796 6.18504 4.40196C6.17704 3.31195 5.83504 2.14296 5.26104 1.14796C5.16134 0.980147 5.13003 0.780412 5.17359 0.590145C5.21716 0.399877 5.33226 0.233666 5.49504 0.125955Z"
        fill="#BF8943"
      />
    </svg>
  );

  const dropdownValue = [
    ...(filterContentCategories ? filterContentCategories : []),
    ...(filterTextCategories ? filterTextCategories : []),
  ];
  const dropdownContent = (
    <Combobox
      defaultValue={dropdownValue}
      value={dropdownValue}
      onChange={(
        filterCategories: (SocialContentCategory | SocialTextCategory)[],
      ) => {
        if (setFilterContentCategories) {
          setFilterContentCategories(
            filterCategories.filter(
              (f) => f in SocialContentCategory,
            ) as SocialContentCategory[],
          );
        }
        if (setFilterTextCategories) {
          setFilterTextCategories(
            filterCategories.filter(
              (f) => f in SocialTextCategory,
            ) as SocialTextCategory[],
          );
        }
      }}
      multiple
    >
      <div className="relative">
        <div className={comboboxClassnames.trigger}>
          <div className={comboboxClassnames.triggerInner}>
            {filterIcon}
            <Combobox.Input
              className={comboboxClassnames.input}
              placeholder="Select content types"
            />
          </div>
          <Combobox.Button className={comboboxClassnames.triggerButton}>
            <ChevronsUpDownIcon
              className="h-4 w-4 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>
        </div>
        <Combobox.Options className={comboboxClassnames.options}>
          {filterContentCategories &&
            contentFilterOptions.map((filter_content_category) => (
              <Combobox.Option
                key={`content-type-dropdown-option-${filter_content_category.value}`}
                className={({ active }) =>
                  `${comboboxClassnames.option} ${active ? "bg-primary/90 text-white" : "text-gray-900"
                  }`
                }
                value={filter_content_category.value}
              >
                {({ selected, active }) => (
                  <div className={comboboxClassnames.optionInner}>
                    <Checkbox
                      className={comboboxClassnames.optionCheckbox}
                      checked={selected}
                    />
                    <Label>{filter_content_category.label}</Label>
                  </div>
                )}
              </Combobox.Option>
            ))}
          {filterTextCategories &&
            textFilterOptions.map((filter_text_category) => (
              <Combobox.Option
                key={`content-type-dropdown-option-${filter_text_category.value}`}
                className={({ active }) =>
                  `${comboboxClassnames.option} ${active ? "bg-primary/90 text-white" : "text-gray-900"
                  }`
                }
                value={filter_text_category.value}
              >
                {({ selected, active }) => (
                  <div className={comboboxClassnames.optionInner}>
                    <Checkbox
                      className={comboboxClassnames.optionCheckbox}
                      checked={selected}
                    />
                    <Label>{filter_text_category.label}</Label>
                  </div>
                )}
              </Combobox.Option>
            ))}
        </Combobox.Options>
      </div>
    </Combobox>
  );

  const triggerContent = (
    <Button variant={"vaultFilter"} size={"vaultFilter"} className="w-full max-w-[400px] ml-auto mr-auto flex items-center justify-between">
      <div className="flex items-center gap-3">
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.49504 0.125955C5.62819 0.0464051 5.77983 0.00307451 5.93491 0.000267683C6.08999 -0.00253914 6.2431 0.0352755 6.37904 0.109955C10.366 1.96196 12.623 5.80796 12.484 9.02396C12.424 10.375 11.941 11.626 11.004 12.539C10.066 13.453 8.71904 13.987 7.01404 13.99C6.32496 14.0326 5.6343 13.9372 4.98257 13.7094C4.33084 13.4816 3.73116 13.1259 3.2187 12.6633C2.70623 12.2006 2.2913 11.6403 1.99824 11.0152C1.70517 10.3901 1.53988 9.71279 1.51204 9.02295V9.01496C1.49168 8.21528 1.69072 7.4253 2.08754 6.73073C2.48436 6.03616 3.06382 5.46352 3.76304 5.07495C3.82378 5.04123 3.89088 5.02054 3.96007 5.0142C4.02925 5.00785 4.09899 5.016 4.16486 5.03811C4.23072 5.06022 4.29125 5.09581 4.34259 5.14262C4.39393 5.18942 4.43495 5.24641 4.46304 5.30996C4.70641 5.86193 5.04756 6.36536 5.47004 6.79596C5.96404 6.15096 6.19204 5.31796 6.18504 4.40196C6.17704 3.31195 5.83504 2.14296 5.26104 1.14796C5.16134 0.980147 5.13003 0.780412 5.17359 0.590145C5.21716 0.399877 5.33226 0.233666 5.49504 0.125955Z"
            fill="#BF8943"
          />
        </svg>
        <div>Select Contents</div>
      </div>
      <ChevronsUpDownIcon
        className="h-4 w-4 text-gray-400 hidden xxs:flex"
        aria-hidden="true"
      />
    </Button>
  );

  const filterContent = (
    <div className="flex flex-col gap-y-3 font-plusjakartasans">
      <div className="hidden text-sm font-semibold md:block">
        Filter by Content Type
      </div>
      <div className="flex w-full justify-between gap-y-6">
        <div className="flex w-full flex-col gap-3 md:flex-row md:flex-wrap">
          {filterContentCategories && setFilterContentCategories && (
            <>
              {contentFilterOptions.map((option) => (
                <div
                  className="flex items-center gap-x-2"
                  key={`cv_filter_category_${option.value}`}
                >
                  <Checkbox
                    defaultChecked={
                      filterContentCategories.findIndex(
                        (v) => v === option.value,
                      ) !== -1
                    }
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFilterContentCategories(
                          filterContentCategories.concat(option.value),
                        );
                      } else {
                        setFilterContentCategories(
                          filterContentCategories.filter(
                            (v) => v !== option.value,
                          ),
                        );
                      }
                    }}
                  />
                  <Label className="text-base md:text-xs">{option.label}</Label>
                </div>
              ))}
            </>
          )}
          {filterTextCategories && setFilterTextCategories && (
            <>
              {textFilterOptions.map((option) => (
                <div
                  className="flex items-center gap-x-2"
                  key={`cv_filter_txt_category_${option.value}`}
                >
                  <Checkbox
                    defaultChecked={
                      filterTextCategories.findIndex(
                        (v) => v === option.value,
                      ) !== -1
                    }
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFilterTextCategories(
                          filterTextCategories.concat(option.value),
                        );
                      } else {
                        setFilterTextCategories(
                          filterTextCategories.filter(
                            (v) => v !== option.value,
                          ),
                        );
                      }
                    }}
                  />
                  <Label className="text-base md:text-xs">{option.label}</Label>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger className="md:hidden" asChild>
          {triggerContent}
        </DialogTrigger>
        <DialogContent small={true}>
          <DialogHeader>
            <DialogTitle>Filter by Content Type</DialogTitle>
          </DialogHeader>
          {filterContent}
          <DialogFooter>
            <Button className="ml-auto" onClick={() => setDialogOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {dropdown ? (
        <div className="hidden md:flex">{dropdownContent}</div>
      ) : (
        <Popover>
          <PopoverTrigger className="hidden md:flex" asChild>
            {triggerContent}
          </PopoverTrigger>
          <PopoverContent sideOffset={12} className="w-96 md:min-w-[600px]">
            {filterContent}
          </PopoverContent>
        </Popover>
      )}
    </>
  );
};

export default ContentTypeFilter;
