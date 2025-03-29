import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

export type ParsedContent = {
  success: boolean;
  title: string;
  text: string;
  image: string;
  error?: string;
};

export function parseContent(
  html: string,
  url: string
): { title: string; text: string; image: string } {
  
  const dom = new JSDOM(html, { url });
  const doc = dom.window.document;

  const reader = new Readability(doc);
  const article = reader.parse();

  if (!article || !article.textContent?.trim()) {
    return {
      success: false,
      title: "",
      text: "",
      image: "",
      error: "Failed to extract readable content from the page.",
    } as ParsedContent;
  }

  const title = article?.title || doc.title || "Untitled";
  const text = (article?.textContent || "").replace(/\s+/g, ' ').trim();


  const ogImage =
    (doc.querySelector('meta[property="og:image"]') as HTMLMetaElement | null)
      ?.content ||
    (doc.querySelector('meta[name="twitter:image"]') as HTMLMetaElement | null)
      ?.content;

  const pageImage =
    (doc.querySelector("article img") as HTMLImageElement | null)?.src ||
    (doc.querySelector("img") as HTMLImageElement | null)?.src;

  const image = ogImage || pageImage || "";

  return {
    title: title,
    text: text,
    image: image,
  };
}
