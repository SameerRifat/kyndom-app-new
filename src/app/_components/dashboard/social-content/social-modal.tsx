import SliderArrow from "@/components/slider-arrow";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Template } from "@/lib/schemas/generic";
import { SocialContentTemplateImage } from "@prisma/client";
import {
  ChevronLeft,
  ChevronRight,
  CopyCheckIcon,
  CopyIcon,
  XIcon,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import useStore from "store/useStore";
import * as Tooltip from '@radix-ui/react-tooltip';
import { useRouter } from "next/navigation";

export const SocialTemplateModal = ({
  children,
  contentTemplate,
}: {
  children?: React.ReactNode;
  contentTemplate: Template;
}) => {
  const router = useRouter()
  const [open, setOpen] = useState<boolean>(false);

  const user = useStore((state) => state.user);

  const openEditor = async () => {
    if (!contentTemplate.canvaUrl) return;
    return window.open(
      contentTemplate.canvaUrl.startsWith("https://")
        ? contentTemplate.canvaUrl
        : `https://${contentTemplate.canvaUrl}`,
      "_blank",
    );
  };
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children ? (
            children
          ) : (
            <Button size={"sm"} className="rounded-lg text-[0.75rem]">
              Use This
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="md:max-h-[95vh] md:overflow-y-auto">
          <div
            className="grid min-w-0 grid-cols-1 gap-y-6 md:grid-cols-2 md:gap-x-6 md:gap-y-0"
          // className="flex min-w-0 flex-col gap-y-6 md:flex-row md:gap-x-6 md:gap-y-0"
          >
            <SocialContentPreviewImages
              previewImages={contentTemplate?.previewImages ?? []}
            />
            <div className="flex w-full flex-col justify-between gap-y-4">
              <h1 className="font-elmessiri text-2xl font-bold">
                {contentTemplate.title}
              </h1>

              <div className="mb-auto max-h-[20rem] overflow-y-auto">
                <div className="font-pjs mt-6 flex flex-col gap-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-md font-semibold">Captions</div>
                    <CopyButton text={contentTemplate.commentsText ?? ""} />
                  </div>
                  <div>
                    {contentTemplate.commentsText?.split("\n").map((line, i) => (
                      <span className="block text-[.9rem] tracking-wide" key={i}>
                        {line}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="font-pjs mt-6 flex flex-col gap-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-md font-semibold">Hashtags</div>
                    <CopyButton text={contentTemplate.hashtagText ?? ""} />
                  </div>
                  <div className="text-[.9rem] tracking-wider">
                    {contentTemplate.hashtagText}
                  </div>
                </div>
              </div>

              <div className="flex w-full flex-col gap-3 md:flex-row">
                {user && user.subscription_status === "ACTIVE" ? (
                  <Button
                    size={"lg"}
                    className="card-btn w-full md:w-1/2"
                    onClick={() => openEditor()}
                    style={{
                      backgroundImage:
                        "linear-gradient(88.35deg, #476DDC -7.64%, #01C3CC 110.51%)",
                    }}
                  >
                    <Image
                      src={"/img/svg/modal-download.svg"}
                      alt={"Download Icon"}
                      width={18}
                      height={18}
                    />
                    Edit in Canva
                  </Button>
                ) : (
                  <Tooltip.Provider>
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <Button
                          size={"lg"}
                          className="card-btn w-full md:w-1/2"
                          style={{
                            backgroundImage:
                              "linear-gradient(88.35deg, #476DDC -7.64%, #01C3CC 110.51%)",
                          }}
                          onClick={() => router.push("/dashboard/settings/billing")}
                        >
                          <Image
                            src={"/img/svg/modal-download.svg"}
                            alt={"Download Icon"}
                            width={18}
                            height={18}
                            priority
                            quality={100}
                          />
                          Edit in Canva
                          <Image
                            src={"/img/svg/sidebar-crown.svg"}
                            alt={"Sidebar Crown"}
                            width={42}
                            height={42}
                          />
                        </Button>
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content className="z-50 border border-gray-50 shadow-sm p-1 px-2 rounded-md bg-white" sideOffset={5}>
                          Unlock premium access to edit in Canva
                          <Tooltip.Arrow className="fill-white" />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                  </Tooltip.Provider>
                )}
                <Button
                  variant={"outline-primary"}
                  size={"lg"}
                  className="card-btn w-full text-primary md:w-1/2"
                  onClick={() => setOpen(false)}
                >
                  <XIcon />
                  Close
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const SocialContentPreviewImages = ({
  previewImages,
}: {
  previewImages: SocialContentTemplateImage[];
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const settings = {
    customPaging: (img: number) => {
      const image = previewImages[img];
      const isSelected = selectedImageIndex === img;
      if (!image) return null;
      return (
        <div className="aspect-[4/5] relative ">
          <Image
            // width={150}
            // height={150}
            alt="preview-image"
            src={image.resourceUrl}
            className={
              "w-full h-full absolute top-0 left-0 rounded-md shadow-md aspect-square object-cover" +
              (isSelected ? " border-[3px] border-green-600" : "")
            }
            fill
            quality={70}
            priority={true}
          />
        </div>
      );
    },
    infinite: false,
    dots: true,
    dotsClass: "slick-dots slick-thumb",
    slidesToShow: 1,
    slidesToScroll: 1,
    slidesPerRow: 1,
    nextArrow: <SliderArrow type="next" />,
    prevArrow: <SliderArrow type="prev" />,
    afterChange: (current: number) => {
      setSelectedImageIndex(current);
    },
  };

  return (
    <div className="slick-arrow relative block min-w-0">
      <div className="block w-full min-w-0">
        <div className="slider-container">
          <Slider {...settings}>
            {previewImages.map((image) => (
              <div key={`content_preivew_image_${image.id}`} className="aspect-[4/5] relative">
                <Image
                  className="h-full w-full absolute top-0 left-0 select-none rounded-xl"
                  // width={500}
                  // height={500}
                  // style={{
                  //   objectFit: "cover",
                  // }}
                  fill
                  src={image.resourceUrl}
                  alt={image.resourceName}
                  priority={true}
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const copyText = () => {
    setCopied(true);
    navigator.clipboard.writeText(text);
    setTimeout(() => {
      setCopied(false);
    }, 650);
  };

  return (
    <Button
      className="text-primary hover:text-primary"
      size={"sm"}
      variant={"ghost"}
      onClick={() => copyText()}
    >
      {copied ? <CopyCheckIcon size={18} /> : <CopyIcon size={18} />}
      <div>{copied ? "Copied" : "Copy"}</div>
    </Button>
  );
};
