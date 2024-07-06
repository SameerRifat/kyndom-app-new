import {
  SocialContentTemplate,
  SocialContentTemplateImage,
  SocialTemplateTag,
  SocialTextTemplate,
} from "@prisma/client";

export type TemplateType = "socialContent" | "socialText";
export type Template = (SocialContentTemplate | SocialTextTemplate) & {
  //Content Templates:
  liked?: boolean;
  commentsText?: string;
  hashtagText?: string;
  canvaUrl?: string;
  previewImages?: SocialContentTemplateImage[];

  //Text Templates:
  content?: string;

  //Generic
  type: TemplateType;
  tag: SocialTemplateTag;
};
