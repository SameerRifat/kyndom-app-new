"use client";

const ColView = ({
  elements,
  columns = 3,
  wThird,
}: {
  elements: React.ReactNode[];
  columns?: number;
  wThird?: boolean;
}) => {
  return (
    <>
      <div
        className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4 md:gap-5 2xl:gap-8"
      >
        {elements.map((element, index) => (
          <div
            key={`el-chunks-item-${index}`}
          >
            {element}
          </div>
        ))}
      </div>
    </>
  );
};

export default ColView;
