import { createClient } from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = createClient();
  const { searchParams } = new URL(req.url);

  const cityIds = searchParams.get("city_id");
  const sort = searchParams.get("sort");
  const tags = searchParams.get("tags");

  const cityIdsArray = cityIds ? cityIds.split(",").map((id) => id.trim()) : [];

  const tagsArray = tags
    ? tags.split(",").map((tag) => Number(tag.trim()))
    : [];

  let query = supabase.from("articles").select("*");

  if (cityIdsArray.length > 0) {
    query = query.in("city_id", cityIdsArray);
  }

  if (tagsArray.length > 0) {
    const { data: articleTags, error: articleTagsError } = await supabase
      .from("article_tags")
      .select("article_id")
      .in("tag_id", tagsArray);

    if (articleTagsError) {
      console.error("Error fetching article_tags:", articleTagsError.message);
      return NextResponse.json(
        { error: "Error fetching article_tags" },
        { status: 500 }
      );
    }

    const articleIds = articleTags.map((at) => at.article_id);

    if (articleIds.length > 0) {
      query = query.in("id", articleIds);
    } else {
      return NextResponse.json([], { status: 200 }); 
    }
  }

  switch (sort) {
    case "alpha_asc":
      query = query.order("title", { ascending: true });
      break;
    case "alpha_desc":
      query = query.order("title", { ascending: false });
      break;
    case "date_asc":
      query = query.order("created_at", { ascending: true });
      break;
    case "date_desc":
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data: articles, error } = await query;

  if (error) {
    console.error("Error fetching articles:", error.message);
    return NextResponse.json(
      { error: "Error fetching articles" },
      { status: 500 }
    );
  }

  return NextResponse.json(articles, { status: 200 });
}
