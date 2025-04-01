import { fetchHTML } from "@/lib/fetchHTML";
import { parseContent } from "@/lib/parseContent";
import { generateTags } from "@/lib/generateTags";
import { generateEmbeddings } from "@/lib/generateEmbeddings";
import { NextRequest, NextResponse } from "next/server";
import { generateDescription } from "@/lib/generateDescription";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url"); // url to be processed
  const city_id = searchParams.get("city_id") // id for city we want post to be a part of


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
          description: "",
          city_id
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
    let description: string = "";


    if (text.trim()) {
      const tagsResult = await generateTags(
        `Article Title: ${title}\nArticle Text: ${text.substring(0, 4000)}`
      );
      const descriptionResult = await generateDescription(
        `Article Title: ${title}\nArticle Text: ${text}`
      );
      if (tagsResult.success && descriptionResult.success) {
        primary_tags = tagsResult.primary_tags;
        secondary_tags = tagsResult.secondary_tags;
        description = descriptionResult.description;
      } else {
        console.warn("Tagging failed:", tagsResult.error);
      }
    }

    return NextResponse.json(
      {
        url,
        title,
        image,
        primary_tags,
        secondary_tags,
        description,
        city_id
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
