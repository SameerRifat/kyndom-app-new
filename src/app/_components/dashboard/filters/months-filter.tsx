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
import { ChevronsUpDownIcon } from "lucide-react";
import { useState } from "react";
import { comboboxClassnames } from "./combobox";

const getValidMonths = () => {
  const currentDate = new Date();

  const startYear = 2023;
  let startMonth = 0;

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const months = [] as string[];
  for (let year = startYear; year <= currentYear; year++) {
    const lastMonth = year === currentYear ? currentMonth : 11;

    for (
      let month = startMonth;
      year === startYear ? month <= lastMonth : month <= 11;
      month++
    ) {
      const monthDate = new Date(year, month);
      const monthStr = monthDate.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      months.push(monthStr);

      startMonth = 0;
    }
  }

  return months;
};

const MonthsFilter = ({
  dropdown,
  filterMonths,
  setFilterMonths,
  popoverAlign = "end",
  allignOffset = -40,
}: {
  dropdown?: boolean;
  filterMonths: string[];
  setFilterMonths: (state: string[]) => void;
  popoverAlign?: "center" | "end" | "start" | undefined;
  allignOffset?: number;
}) => {
  const [searchMonthText, setSearchMonthText] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const months = getValidMonths();

  const filterIcon = (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.22496 3.49996C1.35944 2.84116 1.7174 2.24906 2.23827 1.82386C2.75913 1.39867 3.41091 1.16649 4.08329 1.16663H9.91663C10.589 1.16649 11.2408 1.39867 11.7617 1.82386C12.2825 2.24906 12.6405 2.84116 12.775 3.49996H1.22496ZM1.16663 4.66663V9.91663C1.16663 10.6902 1.47392 11.432 2.0209 11.979C2.56788 12.526 3.30974 12.8333 4.08329 12.8333H9.91663C10.6902 12.8333 11.432 12.526 11.979 11.979C12.526 11.432 12.8333 10.6902 12.8333 9.91663V4.66663H1.16663ZM3.49996 6.41663C3.49996 6.26192 3.56142 6.11354 3.67081 6.00415C3.78021 5.89475 3.92858 5.83329 4.08329 5.83329C4.238 5.83329 4.38638 5.89475 4.49577 6.00415C4.60517 6.11354 4.66663 6.26192 4.66663 6.41663C4.66663 6.57134 4.60517 6.71971 4.49577 6.82911C4.38638 6.9385 4.238 6.99996 4.08329 6.99996C3.92858 6.99996 3.78021 6.9385 3.67081 6.82911C3.56142 6.71971 3.49996 6.57134 3.49996 6.41663ZM3.49996 8.74996C3.49996 8.59525 3.56142 8.44688 3.67081 8.33748C3.78021 8.22809 3.92858 8.16663 4.08329 8.16663C4.238 8.16663 4.38638 8.22809 4.49577 8.33748C4.60517 8.44688 4.66663 8.59525 4.66663 8.74996C4.66663 8.90467 4.60517 9.05304 4.49577 9.16244C4.38638 9.27184 4.238 9.33329 4.08329 9.33329C3.92858 9.33329 3.78021 9.27184 3.67081 9.16244C3.56142 9.05304 3.49996 8.90467 3.49996 8.74996ZM6.41663 5.83329C6.57134 5.83329 6.71971 5.89475 6.82911 6.00415C6.9385 6.11354 6.99996 6.26192 6.99996 6.41663C6.99996 6.57134 6.9385 6.71971 6.82911 6.82911C6.71971 6.9385 6.57134 6.99996 6.41663 6.99996C6.26192 6.99996 6.11354 6.9385 6.00415 6.82911C5.89475 6.71971 5.83329 6.57134 5.83329 6.41663C5.83329 6.26192 5.89475 6.11354 6.00415 6.00415C6.11354 5.89475 6.26192 5.83329 6.41663 5.83329ZM5.83329 8.74996C5.83329 8.59525 5.89475 8.44688 6.00415 8.33748C6.11354 8.22809 6.26192 8.16663 6.41663 8.16663C6.57134 8.16663 6.71971 8.22809 6.82911 8.33748C6.9385 8.44688 6.99996 8.59525 6.99996 8.74996C6.99996 8.90467 6.9385 9.05304 6.82911 9.16244C6.71971 9.27184 6.57134 9.33329 6.41663 9.33329C6.26192 9.33329 6.11354 9.27184 6.00415 9.16244C5.89475 9.05304 5.83329 8.90467 5.83329 8.74996ZM8.74996 5.83329C8.90467 5.83329 9.05304 5.89475 9.16244 6.00415C9.27184 6.11354 9.33329 6.26192 9.33329 6.41663C9.33329 6.57134 9.27184 6.71971 9.16244 6.82911C9.05304 6.9385 8.90467 6.99996 8.74996 6.99996C8.59525 6.99996 8.44688 6.9385 8.33748 6.82911C8.22809 6.71971 8.16663 6.57134 8.16663 6.41663C8.16663 6.26192 8.22809 6.11354 8.33748 6.00415C8.44688 5.89475 8.59525 5.83329 8.74996 5.83329Z"
        fill="#5E72C5"
      />
    </svg>
  );

  const dropdownContent = (
    <Combobox value={filterMonths} onChange={setFilterMonths} multiple>
      <div className="relative">
        <div className={comboboxClassnames.trigger}>
          <div className={comboboxClassnames.triggerInner}>
            {filterIcon}
            <Combobox.Input
              className={comboboxClassnames.input}
              placeholder="Select months"
              onChange={(event) => setSearchMonthText(event.target.value)}
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
          {months.map((month) => (
            <Combobox.Option
              key={`month-dropdown-option-${month.replaceAll(" ", "")}`}
              className={({ active }) =>
                `${comboboxClassnames.option} ${active ? "bg-primary/90 text-white" : "text-gray-900"
                }`
              }
              value={month}
            >
              {({ selected, active }) => (
                <div className={comboboxClassnames.optionInner}>
                  <Checkbox
                    className={comboboxClassnames.optionCheckbox}
                    checked={selected}
                  />
                  <Label>{month}</Label>
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
        <div>Select Months</div>
      </div>
      <ChevronsUpDownIcon
        className="h-4 w-4 text-gray-400 hidden xxs:flex"
        aria-hidden="true"
      />
    </Button>
  );

  const filterContent = (dialog: boolean) => (
    <div className="flex flex-col gap-y-3 font-plusjakartasans">
      <div className="hidden text-sm font-semibold md:block">
        Filter by Month
      </div>
      <div
        className={`flex w-full flex-col gap-3 md:flex-row md:flex-wrap ${dialog && "h-[400px] max-h-[400px] overflow-y-auto"}`}
      >
        {months.map((month) => (
          <div
            className="flex items-center gap-x-2"
            key={`cv_filter_months-${month}`}
          >
            <Checkbox
              defaultChecked={filterMonths.findIndex((m) => m === month) !== -1}
              onCheckedChange={(checked) => {
                if (checked) {
                  setFilterMonths(filterMonths.concat(month));
                } else {
                  setFilterMonths(filterMonths.filter((t) => t !== month));
                }
              }}
            />
            <Label className="text-base md:text-xs">{month}</Label>
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
            <DialogTitle>Filter by Months</DialogTitle>
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
            align={popoverAlign}
            sideOffset={12}
            alignOffset={allignOffset}
            className="w-96 md:min-w-[600px]"
          >
            {filterContent(false)}
          </PopoverContent>
        </Popover>
      )}
    </>
  );
};

export default MonthsFilter;
