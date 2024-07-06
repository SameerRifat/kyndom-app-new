"use client";
import SliderArrow from "@/components/slider-arrow";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Template } from "@/lib/schemas/generic";
import { api } from "@/trpc/react";
import { SocialContentCategory, SocialContentTemplateImage, SocialTemplateTag, SocialTextCategory } from "@prisma/client";
import { CalendarIcon, Loader2Icon } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import FullPageRow from "../general/full-page-row";
import { SocialTemplateModal } from "../social-content/social-modal";
import { TemplateLiked, TemplateTag } from "../social-content/social-template";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FilterIcon } from "lucide-react";
import ContentVaultTagsFilter from "@/app/_components/dashboard/filters/tags-filter";
import ContentVaultTypeFilter from "@/app/_components/dashboard/filters/content-type-filter";
import { useEffect, useState } from "react";
import FilterControls from "@/app/_components/dashboard/filters/filter-controls";
import ContentPageLoading from "@/app/_components/dashboard/general/content-page-loading";
import NoResults from "../filters/no-results";
import { useInView } from "react-intersection-observer";

const ContentCalendar = ({ date, vaultToggleFilters }: { date: Date, vaultToggleFilters: boolean }) => {
  const { ref, inView } = useInView();
  const ItemsPerPage = 24;
  // const [vaultToggleFilters, setVaultToggleFilters] = useState<boolean>(false);
  const [calendarItems, setCalendarItems] = useState<Template[]>([]);
  const [filterTags, setFilterTags] = useState<SocialTemplateTag[]>([]);
  const [initalSearched, setInitialSearched] = useState<boolean>(true);
  const [filterContentCategories, setFilterContentCategories] = useState<SocialContentCategory[]>([]);
  const [filterTextCategories, setFilterTextCategories] = useState<SocialTextCategory[]>([]);
  const [calenderPage, setCalendarPage] = useState<number>(0);
  const [totalResults, setTotalResults] = useState<number>(0);

  const { data, fetchStatus, refetch } = api.contentCalendar.getCalendar.useQuery({
    date: date,
    filter_tags: filterTags.length > 0 ? filterTags.map((t) => t.id) : undefined,
    filter_category: filterContentCategories.length > 0 ? filterContentCategories : undefined,
    skip: calenderPage * ItemsPerPage,
    take: ItemsPerPage,
  });

  // Fetch data when filters change
  useEffect(() => {
    setCalendarPage(0);
    setCalendarItems([]);
    setTotalResults(0)
  }, [filterTags, filterContentCategories, filterTextCategories, date]);

  // Update calendarItems state with new data
  useEffect(() => {
    if (!data?.templates) return;

    setTotalResults(data.total);

    // Check if fetched data already exists in calendarItems
    const existingIds = new Set(calendarItems.map(item => item.id));
    const newTemplates = data.templates.filter(template => !existingIds.has(template.id));

    setCalendarItems((prevItems) =>
      calenderPage === 0 ? data.templates : [...prevItems, ...newTemplates]
    );
  }, [data, calenderPage]);

  // useEffect(() => {
  //   if (!data?.templates) return;
  //   setTotalResults(data.total);
  //   setCalendarItems(data.templates);
  // }, [data]);

  useEffect(() => {
    if (inView && fetchStatus !== "fetching" && calendarItems.length < totalResults) {
      setCalendarPage((prevPage) => prevPage + 1);
    }
  }, [inView, fetchStatus, calendarItems.length, totalResults]);

  const clearSearch = () => {
    setFilterTags([]);
    setFilterContentCategories([]);
    setCalendarItems([]);
    setCalendarPage(0)
    refetch();
  };

  const filtersContent = (
    <>
      <ContentVaultTagsFilter
        filterTags={filterTags}
        setFilterTags={setFilterTags}
        dropdown={initalSearched}
      />
      <ContentVaultTypeFilter
        filterContentCategories={filterContentCategories}
        setFilterContentCategories={setFilterContentCategories}
        filterTextCategories={filterTextCategories}
        setFilterTextCategories={setFilterTextCategories}
        dropdown={initalSearched}
      />
    </>
  );

  return (
    <>
      <div>
        {/* <div className="flex justify-end">
          <Button
            variant={"vaultFilter"}
            size={"vaultOption"}
            onClick={() => setVaultToggleFilters(!vaultToggleFilters)}
          >
            <FilterIcon className="text-primary" size={18} />
            <div className="hidden md:flex">Available Filters</div>
          </Button>
        </div> */}
        {vaultToggleFilters && (
          <div className="flex flex-col gap-y-4 md:flex-row md:gap-x-4 my-5">
            {filtersContent}
          </div>
        )}
        <FilterControls
          filterTags={filterTags}
          setFilterTags={setFilterTags}
          filterContentCategories={filterContentCategories}
          setFilterContentCategories={setFilterContentCategories}
          filterTextCategories={filterTextCategories}
          setFilterTextCategories={setFilterTextCategories}
          clearSearch={clearSearch}
        />
        <div className="flex mb-5">
          Viewing {calendarItems.length || 0} of {totalResults || 0} results
        </div>
        {calendarItems.length === 0 && fetchStatus === "fetching" ? (
          <ContentCalendarLoading />
        ) : (
          <>
            {calendarItems.length > 0 ? (
              <div className="w-full grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 xl:gap-7 2xl:gap-12 mt-5">
                <CalendarTemplates contentTemplates={calendarItems ?? []} />
              </div>
            ) : (
              <NoResults />
            )}
            {calendarItems.length < totalResults && fetchStatus === "fetching" && (
              <div className="flex h-10 w-full items-center justify-center mt-5">
                <div className="animate-spin">
                  <Loader2Icon className="text-primary" size={32} />
                </div>
              </div>
            )}
            {calendarItems.length < totalResults && fetchStatus !== "fetching" && <div ref={ref} />}
          </>
        )}
      </div>
    </>
  );
};

export default ContentCalendar;

const CalendarTemplates = ({
  contentTemplates,
}: {
  contentTemplates: Template[];
}) => {
  return (
    <>
      {contentTemplates.map((socialContentTemplate, index) => (
        <CalendarContentTemplate
          template={socialContentTemplate}
          key={`social-content-template-${socialContentTemplate.id}-${index}`}
        />
      ))}
    </>
  );
};

const CalendarContentTemplate = ({
  template,
  liked = false,
  colview = false,
}: {
  template: Template;
  sidebarKey?: string | null;
  liked?: boolean;
  colview?: boolean;
}) => {

  return (
    <div
      className="bg-white rounded-2xl shadow-md"
    >
      <div className="flex justify-between px-4 pr-2 md:pr-4 md:px-5">
        <div className="flex h-14 items-center gap-x-2 font-semibold text-foreground">
          {/* <CalendarIcon size={16} /> */}
          <div>
            {template.releaseDate!.getDate()}{" "}
            {template.releaseDate!.toLocaleString("default", {
              month: "long",
            })}
          </div>
        </div>
        <div className="flex items-center gap-1 md:gap-2">
          <TemplateTag tag={template.tag} />
          <TemplateLiked
            id={template.id}
            template={template}
            liked={liked || (template.liked ?? false)}
          />
        </div>
      </div>
      {template.previewImages !== undefined && template.previewImages.length > 0 && (
        template.previewImages.length > 1 ? (
          <CalendarTemplatePreviewImages
            previewImages={template.previewImages}
          />
        ) : (
          <div className="aspect-[4/5] relative max-h-[600px]">
            <Image
              src={template.previewImages[0]?.resourceUrl || ''}
              alt="image"
              // width={300}
              // height={400}
              fill
              className="w-full h-full absolute top-0 left-0 object-cover"
              priority={true}
              quality={100}
            />
          </div>
        )
      )}
      <div className="flex flex-col gap-y-4 p-4">
        <Tooltip>
          <TooltipTrigger>
            <div className="truncate text-left text-base text-black">
              {template.title}
            </div>
          </TooltipTrigger>
          <TooltipContent sideOffset={4} className="text-sm">
            {template.title}
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="flex flex-col gap-y-4 p-4 pt-0">
        <SocialTemplateModal contentTemplate={template} />
      </div>
    </div>
  );
};

const CalendarTemplatePreviewImages = ({
  previewImages,
}: {
  previewImages: SocialContentTemplateImage[];
}) => {
  const settings = {
    infinite: true,
    dots: true,
    dotsClass: "dots-style",
    slidesToShow: 1,
    slidesToScroll: 1,
    slidesPerRow: 1,
    nextArrow: <SliderArrow type="next" isNotModal />,
    prevArrow: <SliderArrow type="prev" isNotModal />,
  };

  return (
    <div className="slick-arrow relative block w-full min-w-0">
      <div className="block w-full min-w-0">
        <div className="slider-container">
          <Slider {...settings}>
            {previewImages.map((image) => (
              <div key={`content_preivew_image_${image.id}`} className="aspect-[4/5] relative max-h-[600px]">
                
                <Image
                  className="w-full h-full absolute top-0 left-0 select-none object-cover"
                  // width={300}
                  // height={400}
                  // style={{
                  //   objectFit: "cover",
                  // }}
                  fill
                  src={image.resourceUrl}
                  alt={image.resourceName}
                  priority={true}
                  quality={100}
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

const ContentCalendarLoading = () => {
  return (
    <div className="w-full grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 xl:gap-7 2xl:gap-12 mt-5">
      {Array.from(Array(12).keys()).map((row, index) => (
        <div
          key={`content-calendar-loading-${index}`}
          className="relative w-full overflow-hidden rounded-2xl"
          style={{
            paddingBottom: `calc(100% * 5 / 4 + 164px)`, 
            height: 0,
          }}
        >
          <Skeleton className="absolute top-0 left-0 w-full h-full rounded-2xl" />
        </div>
      ))}
    </div>
  )
}
