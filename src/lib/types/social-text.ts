import { Prisma } from "@prisma/client";

export type ISocialTextTemplate = Prisma.SocialTextTemplateGetPayload<{
  include: { tag: true };
}>;
