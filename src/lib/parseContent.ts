import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

export function parseContent(
  html: string,
  url: string
): { title: string; text: string; image: string } {
  const dom = new JSDOM(html, { url });
  const doc = dom.window.document;

  const reader = new Readability(doc);
  const article = reader.parse();

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

  const fallback = "https://i.scdn.co/image/ab67616d0000b27340785d18b8695438070d83b1";

  const image = ogImage || pageImage || fallback;

  return {
    title: title,
    text: text,
    image: image,
  };
}
