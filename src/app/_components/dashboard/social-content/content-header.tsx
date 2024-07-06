"use client";

const ContentHeader = ({ category }: { category: string }) => {
  return (
    <div className="flex w-full flex-col py-6">
      <h1 className="font-elmessiri text-3xl capitalize leading-6">
        {category.replace("_", " ")}{" "}
        {!category.includes("templates") && "Templates"}
      </h1>
    </div>
  );
};

export default ContentHeader;
