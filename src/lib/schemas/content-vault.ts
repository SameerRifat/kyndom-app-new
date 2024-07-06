import { SocialContentCategory, SocialTextCategory } from "@prisma/client";
import { z } from "zod";

export const SearchContentVaultSchema = z.object({
  filter_title: z.string().optional(),
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
