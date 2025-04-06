import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";
import { Article } from "@/types";
import { generateEmbeddings } from "@/lib/generateEmbeddings";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { searchParams } = new URL(req.url);

  const url = searchParams.get("url");
  const title = searchParams.get("title");
  const image_url = searchParams.get("image_url");
  const description = searchParams.get("description");
  const tagsRaw = searchParams.get("tags");
  const city_id = searchParams.get("city_id");
  const user_id = searchParams.get("user_id");

  if (!url || !title || !description || !tagsRaw || !city_id || !user_id) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  const tags: string[] = tagsRaw.split(",").map((tag) => tag.trim());

  let embedding: number[];

  try {
    embedding = await generateEmbeddings(`${title}\n${description}`);
  } catch (err: any) {
    console.error("Embedding generation failed:", err.message);
    return NextResponse.json(
      { error: "Failed to generate embedding." },
      { status: 500 }
    );
  }

  const { data: article, error: insertError } = await supabase
    .from("articles")
    .insert([
      {
        url,
        title,
        image_url,
        description,
        embedding,
        tags,
        city_id,
        user_id,
      },
    ])
    .select()
    .single();

  if (insertError) {
    return NextResponse.json(
      { error: "Failed to insert article.", details: insertError.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: "Article posted!", article },
    { status: 201 }
  );
}
