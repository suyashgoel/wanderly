import { fetchHTML } from "@/lib/fetchHTML";
import { parseContent } from "@/lib/parseContent";
import { generateTags } from "@/lib/generateTags";
import { generateEmbeddings } from "@/lib/generateEmbeddings";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing ?url=" }, { status: 400 });
  }

  try {
    const html = await fetchHTML(url);
    const { title, text, image } = parseContent(html, url);

    const [primary_tags, secondary_tags] = await generateTags(`
      Article Title: ${title.trim()}
      Article Text: ${text.trim()}
    `);

    const embedding = await generateEmbeddings(`
      ${title.trim()}
      ${text.trim()}
    `);

    return NextResponse.json({
      url,
      title,
      image,
      primary_tags,
      secondary_tags,
      embedding,
    }, {status: 200});
  } catch (err) {
    console.error("Scrape error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
