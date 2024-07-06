import { Prisma } from "@prisma/client";

export type SocialContentTemplateTagsImages =
  Prisma.SocialContentTemplateGetPayload<{
    include: { tag: true; previewImages: true };
  }>;
