"use client";
import FullPageRow from "@/app/_components/dashboard/general/full-page-row";
import SocialContentTemplate from "@/app/_components/dashboard/social-content/social-template";
import { Template } from "@/lib/schemas/generic";

export default ({ contentTemplates }: { contentTemplates: Template[] }) => {
  return (
    <FullPageRow>
      {contentTemplates.map((socialContentTemplate, index) => (
        <SocialContentTemplate
          template={socialContentTemplate}
          key={`social-content-template-${socialContentTemplate.id}-${index}`}
        />
      ))}
    </FullPageRow>
  );
};
