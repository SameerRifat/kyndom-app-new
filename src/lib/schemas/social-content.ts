import { SocialContentCategory } from "@prisma/client";
import { z } from "zod";

export const SearchContentTemplatesSchema = z.object({
  filter_title: z.string().optional(),
  filter_tags: z.string().array().optional(),
  filter_category: z.nativeEnum(SocialContentCategory).array().optional(),
  filter_months: z.string().array().optional(),
  sort_by: z.enum(["oldest", "newest"]),
  skip: z.number().optional(),
  take: z.number().optional(),
});

export const LikeSocialTemplate = z.object({
  id: z.string(),
  status: z.boolean(),
});
