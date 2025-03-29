import { fetchHTML } from "@/lib/fetchHTML";
import { parseContent } from "@/lib/parseContent";
import { generateTags } from "@/lib/generateTags";
import { generateEmbeddings } from "@/lib/generateEmbeddings";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url||!/^https?:\/\//.test(url)) {
    return NextResponse.json({ error: "Missing ?url=" }, { status: 400 });
  }

  try {
    let html = "";
    try {
      html = await fetchHTML(url);
    } catch (error: any) {
      return NextResponse.json(
        {
          url,
          title: "Untitled",
          image: "",
          primary_tags: [],
          secondary_tags: [],
          embedding: null,
          missing: true
        },
        { status: 200 }
      );
    }

    const {
      title = "Untitled",
      text = "",
      image = "",
    } = parseContent(html, url) ?? {};

    let primary_tags: string[] = [];
    let secondary_tags: string[] = [];

    if (text.trim()) {
      const tagsResult = await generateTags(
        `Article Title: ${title}\nArticle Text: ${text}`
      );
      if (tagsResult.success) {
        primary_tags = tagsResult.primary_tags;
        secondary_tags = tagsResult.secondary_tags;
      } else {
        console.warn("Tagging failed:", tagsResult.error);
      }
    }

    let embedding = null;
    if (text.trim()) {
      try {
        embedding = await generateEmbeddings(
          `${title}\n${text.substring(0, 1500)}`
        );
      } catch (error) {
        console.warn("Embedding generation failed:", error);
      }
    }

    return NextResponse.json(
      {
        url,
        title,
        image,
        primary_tags,
        secondary_tags,
        embedding,
        missing: false
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Scrape error:", err);
    return NextResponse.json(
      { error: "Something went wrong while processing." },
      { status: 500 }
    );
  }
}
