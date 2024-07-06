import { SocialContentCategory, SocialTextCategory } from "@prisma/client";
import { z } from "zod";

export const GetRecentContentTemplatesSchema = z.object({
  category: z.nativeEnum(SocialContentCategory).optional(),
  take: z.number().optional(),
});

export const GetRecentTextTemplatesSchema = z.object({
  category: z.nativeEnum(SocialTextCategory).optional(),
  take: z.number().optional(),
});
