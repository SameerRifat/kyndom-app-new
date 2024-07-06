const NoResults = () => {
  return (
    <div className="flex w-full flex-col gap-y-2 md:items-center">
      <div className="text-xl font-semibold text-primary">No Results</div>
      <div className="text-base text-orange">
        Your search returned no results
      </div>
    </div>
  );
};

export default NoResults;
