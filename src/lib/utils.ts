import { env } from "@/env";
import { SocialTemplateTag } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ZodObjectId = z.string().regex(/^[0-9a-fA-F]{24}$/);

export const readableEnum = (value: string) => {
  let s = value.split("_").map((v, index) => {
    return v.charAt(0).toUpperCase() + v.slice(1).toLowerCase();
  });

  return s.join(" ");
};

export const generateEditorUrl = (
  code: string,
  designId: string,
  designer: boolean,
) => {
  return `${env.NEXT_PUBLIC_EDITOR_URL}#code=${code}#content=${designId}${designer ? "#designer" : ""}`;
};

export const templateHasTag = (
  templateTags: SocialTemplateTag[],
  filterTags: SocialTemplateTag[],
) => {
  for (let i = 0; i < filterTags.length; i++) {
    if (templateTags.findIndex((t) => t.id === filterTags[i]?.id) !== -1)
      return true;
  }
  return false;
};


export const preprocessResponse = (text) => {
  if (typeof text !== 'string') {
    return '';
  }

  // Replace **word** with <strong>word</strong>
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Replace hash tags with corresponding <h1> to <h6> tags
  text = text.replace(/^###### (.*)/gm, '<h6>$1</h6>');
  text = text.replace(/^##### (.*)/gm, '<h5>$1</h5>');
  text = text.replace(/^#### (.*)/gm, '<h4>$1</h4>');
  text = text.replace(/^### (.*)/gm, '<h3>$1</h3>');
  text = text.replace(/^## (.*)/gm, '<h2>$1</h2>');
  text = text.replace(/^# (.*)/gm, '<h1>$1</h1>');

  // Replace - bullet points with <li>bullet points</li>
  text = text.replace(/^- (.*)/gm, '<li>$1</li>');

  // Wrap the entire text in <ul> if it contains bullet points
  if (text.includes('<li>')) {
    text = `<ul>${text}</ul>`;
  }

  return text;
};
