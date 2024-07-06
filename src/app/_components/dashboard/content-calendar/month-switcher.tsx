import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterIcon } from "lucide-react";

const DateNavigator = ({
  date,
  setDate,
  vaultToggleFilters,
  setVaultToggleFilters
}: {
  date: Date;
  setDate: (state: Date) => void;
  vaultToggleFilters: boolean;
  setVaultToggleFilters: (value: boolean) => void;
}) => {
  const lastMonth = () => {
    const newDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    setDate(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    setDate(newDate);
  };

  return (
    <div className="flex w-full justify-center relative">
      <div className="font-pjs flex select-none items-center gap-x-4 text-xl font-bold uppercase">
        <div
          className="text-black/50 hover:cursor-pointer hover:underline"
          onClick={lastMonth}
        >
          <ArrowLeft />
        </div>
        <div>
          {date.toLocaleString("default", { month: "long" })}{" "}
          {date.getFullYear()}
        </div>
        <div
          className="select-none text-black/50 hover:cursor-pointer hover:underline"
          onClick={nextMonth}
        >
          <ArrowRight />
        </div>
      </div>
      <div className="flex justify-end absolute right-0 -bottom-[190%] xs:bottom-0">
        <Button
          variant={"vaultFilter"}
          size={"vaultOption"}
          onClick={() => setVaultToggleFilters(!vaultToggleFilters)}
        >
          <FilterIcon className="text-primary" size={18} />
          <div className="hidden md:flex">Available Filters</div>
        </Button>
        {/* <SearchSortBy sortBy={sortBy} setSortBy={setSortBy} /> */}
      </div>
    </div>
  );
};

export default DateNavigator;



// import { ArrowLeft, ArrowRight } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { FilterIcon } from "lucide-react";

// export default ({
//   date,
//   setDate,
//   vaultToggleFilters,
//   setVaultToggleFilters
// }: {
//   date: Date;
//   setDate: (state: Date) => void;
//   vaultToggleFilters: boolean;
//   setVaultToggleFilters: (value: boolean) => void;
// }) => {
//   const lastMonth = () => {
//     const currentMonth = date.getMonth();
//     if (currentMonth - 1 < 0) {
//       let d = new Date();
//       d.setFullYear(date.getFullYear() - 1);
//       d.setMonth(11);
//       setDate(d);
//     } else {
//       let d = new Date();
//       d.setMonth(date.getMonth() - 1);
//       d.setFullYear(date.getFullYear());
//       setDate(d);
//     }
//   };
//   console.log('date: ', date)

//   const nextMonth = () => {
//     const currentMonth = date.getMonth();
//     if (currentMonth + 1 >= 12) {
//       let d = new Date();
//       d.setFullYear(date.getFullYear() + 1);
//       d.setMonth(0);
//       setDate(d);
//     } else {
//       let d = new Date();
//       d.setMonth(date.getMonth() + 1);
//       d.setFullYear(date.getFullYear());
//       setDate(d);
//     }
//   };

//   return (
//     <div className="flex w-full justify-center relative">
//       <div className="font-pjs flex select-none items-center gap-x-4 text-xl font-bold uppercase">
//         <div
//           className="text-black/50 hover:cursor-pointer hover:underline"
//           onClick={() => lastMonth()}
//         >
//           <ArrowLeft />
//         </div>
//         <div>
//           {date.toLocaleString("default", { month: "long" })}{" "}
//           {date.getFullYear()}
//         </div>
//         <div
//           className="select-none text-black/50 hover:cursor-pointer hover:underline"
//           onClick={() => nextMonth()}
//         >
//           <ArrowRight />
//         </div>
//       </div>
//       <div className="flex justify-end absolute right-0 -bottom-[190%] xs:bottom-0">
//           <Button
//             variant={"vaultFilter"}
//             size={"vaultOption"}
//             onClick={() => setVaultToggleFilters(!vaultToggleFilters)}
//           >
//             <FilterIcon className="text-primary" size={18} />
//             <div className="hidden md:flex">Available Filters</div>
//           </Button>
//           {/* <SearchSortBy sortBy={sortBy} setSortBy={setSortBy} /> */}
//         </div>
//     </div>
//   );
// };
