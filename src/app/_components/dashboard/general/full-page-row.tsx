import { cn } from "@/lib/utils";

export default ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <>
      <div className={cn("w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 2xl:gap-8", className)}>
        {children}
      </div>
    </>
  );
};
