"use client";
import FullPageRow from "@/app/_components/dashboard/general/full-page-row";
import { Template } from "@/lib/schemas/generic";
import SocialTextTemplate from "./social-text-template";

export default ({ textTemplates }: { textTemplates: Template[] }) => {
  return (
    <FullPageRow>
      {textTemplates.map((socialTextTemplate) => (
        <SocialTextTemplate
          template={socialTextTemplate}
          key={`social-text-template-${socialTextTemplate.id}`}
        />
      ))}
    </FullPageRow>
  );
};
