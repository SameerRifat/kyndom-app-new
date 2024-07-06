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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";
import { Combobox } from "@headlessui/react";
import { SocialTemplateTag } from "@prisma/client";
import { ChevronsUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { comboboxClassnames } from "./combobox";
import { cn } from "@/lib/utils";

const TagsFilter = ({
  dropdown,
  filterTags,
  setFilterTags,
}: {
  dropdown?: boolean;
  filterTags: SocialTemplateTag[];
  setFilterTags: (state: SocialTemplateTag[]) => void;
}) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [searchTagText, setSearchTagText] = useState<string>("");

  const [tags, setTags] = useState<SocialTemplateTag[]>([]);

  const tagsQuery = api.socialContent.getSocialTemplateTags.useQuery();

  useEffect(() => {
    if (!tagsQuery.data) return;
    setTags(tagsQuery.data);
  }, [tagsQuery.data]);

  useEffect(() => {
    if (!tagsQuery.data) return;
    if (searchTagText.length > 0) {
      setTags(
        tagsQuery.data.filter((t) =>
          t.name.toLowerCase().includes(searchTagText.toLowerCase()),
        ),
      );
    } else {
      setTags(tagsQuery.data);
    }
  }, [searchTagText]);

  if (!tagsQuery.data)
    return (
      <Skeleton
        className={`h-[42px] w-full rounded-xl md:w-fit md:min-w-[140px] ${dropdown ? " md:min-w-[257px]" : ""}`}
      />
    );

  const filterIcon = (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.89583 4.95829C3.61404 4.95829 3.34379 4.84635 3.14453 4.64709C2.94527 4.44784 2.83333 4.17759 2.83333 3.89579C2.83333 3.614 2.94527 3.34375 3.14453 3.14449C3.34379 2.94523 3.61404 2.83329 3.89583 2.83329C4.17762 2.83329 4.44787 2.94523 4.64713 3.14449C4.84639 3.34375 4.95833 3.614 4.95833 3.89579C4.95833 4.17759 4.84639 4.44784 4.64713 4.64709C4.44787 4.84635 4.17762 4.95829 3.89583 4.95829ZM15.1654 8.20246L8.79041 1.82746C8.53541 1.57246 8.18125 1.41663 7.79166 1.41663H2.83333C2.04708 1.41663 1.41666 2.04704 1.41666 2.83329V7.79163C1.41666 8.18121 1.5725 8.53538 1.83458 8.79038L8.2025 15.1654C8.46458 15.4204 8.81875 15.5833 9.20833 15.5833C9.59791 15.5833 9.95208 15.4204 10.2071 15.1654L15.1654 10.207C15.4275 9.95204 15.5833 9.59788 15.5833 9.20829C15.5833 8.81163 15.4204 8.45746 15.1654 8.20246Z"
        fill="#BF4395"
        fillOpacity="0.94"
      />
    </svg>
  );

  const dropdownContent = (
    <Combobox value={filterTags} onChange={setFilterTags} by="id" multiple>
      <div className="relative">
        <div className={comboboxClassnames.trigger}>
          <div className={comboboxClassnames.triggerInner}>
            {filterIcon}
            <Combobox.Input
              className={comboboxClassnames.input}
              placeholder="Select tags"
              onChange={(event) => setSearchTagText(event.target.value)}
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
          {tags.map((tag) => (
            <Combobox.Option
              key={`tag-dropdown-option-${tag.id}`}
              className={({ active }) =>
                `${comboboxClassnames.option} ${active ? "bg-primary/90 text-white" : "text-gray-900"
                }`
              }
              value={tag}
            >
              {({ selected, active }) => (
                <div className={comboboxClassnames.optionInner}>
                  <Checkbox
                    className={comboboxClassnames.optionCheckbox}
                    checked={selected}
                  />
                  <Label>{tag.name}</Label>
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
        {filterIcon}
        <div>Select Tags</div>
      </div>
      <ChevronsUpDownIcon
        className="h-4 w-4 text-gray-400 hidden xxs:flex"
        aria-hidden="true"
      />
    </Button>
  );

  const filterContent = (dialog: boolean) => (
    <div
      className={`flex flex-col ${dialog ? "gap-y-3" : "gap-y-6"} font-plusjakartasans`}
    >
      <div className="hidden text-sm font-semibold md:block">
        Filter by Tags
      </div>
      {dialog && (
        <div className="flex flex-col gap-y-1">
          <div className="text-sm font-semibold">Search tags</div>
          <Input
            value={searchTagText}
            onChange={(e) => setSearchTagText(e.target.value)}
            onClick={() => setDialogOpen(true)}
          />
        </div>
      )}
      <div
        className={`flex w-full flex-col gap-3 md:flex-row md:flex-wrap ${dialog && "h-[400px] max-h-[400px] overflow-y-auto"}`}
      >
        {tags.map((tag) => (
          <div
            className="flex items-center gap-x-2"
            key={`cv_filter_tag-${tag.id}`}
          >
            <Checkbox
              defaultChecked={
                filterTags.findIndex((t) => t.id === tag.id) !== -1
              }
              onCheckedChange={(checked) => {
                if (checked) {
                  setFilterTags(filterTags.concat(tag));
                } else {
                  setFilterTags(filterTags.filter((t) => t.id !== tag.id));
                }
              }}
            />
            <Label className="text-base md:text-xs">{tag.name}</Label>
          </div>
        ))}
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
            <DialogTitle>Filter by Tags</DialogTitle>
          </DialogHeader>
          {filterContent(true)}
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
          <PopoverContent
            align={"start"}
            sideOffset={12}
            alignOffset={-40}
            className="w-96 md:min-w-[600px]"
          >
            {filterContent(false)}
          </PopoverContent>
        </Popover>
      )}
    </>
  );
};

export default TagsFilter;
