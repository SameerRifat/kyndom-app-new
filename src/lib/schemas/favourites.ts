import { SocialContentCategory, SocialTextCategory } from "@prisma/client";
import { z } from "zod";

export const GetFavouritesSchema = z.object({
  filter_tags: z.string().array().optional(),
  filter_category_social_content: z
    .nativeEnum(SocialContentCategory)
    .array()
    .optional(),
  filter_category_social_text: z
    .nativeEnum(SocialTextCategory)
    .array()
    .optional(),
  filter_months: z.string().array().optional(),
  sort_by: z.enum(["oldest", "newest"]),
  skip: z.number().optional(),
  take: z.number().optional(),
});
