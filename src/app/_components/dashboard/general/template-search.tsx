import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

const TemplateSearch = ({
  loading,
  defaultValue,
  onChange,
  placeholder,
  onSearch,
}: {
  loading: boolean;
  defaultValue: string;
  onChange: (state: string) => void;
  placeholder?: string;
  onSearch: () => void;
}) => {
  const searchButton = (
    <Button
      size={"search"}
      variant={"search"}
      disabled={!(defaultValue.length > 0) || loading}
      // onClick={() => onSearch()}
      onClick={onSearch}
    >
      Search
    </Button>
  );

  return (
    <div className="flex w-full flex-col items-center gap-y-4">
      <div className="flex h-[42px] w-full items-center justify-between rounded-[27px] border-2 border-solid border-[#CECECE] bg-[#dbdbdb59] md:w-fit md:min-w-[500px]">
        <div className="flex w-full items-center gap-x-2 px-3 md:px-4">
          <SearchIcon className="text-primary" size={19} />
          <SearchInput
            placeholder={placeholder}
            value={defaultValue}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSearch();
            }}
          />
        </div>
        <div className="hidden px-1 md:flex">{searchButton}</div>
      </div>
      <div className="flex w-full justify-end md:hidden">{searchButton}</div>
    </div>
  );
};

export default TemplateSearch;
