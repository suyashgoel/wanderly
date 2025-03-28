import { createClient } from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";
import { generateEmbeddings } from "@/lib/generateEmbeddings";
import { Article } from "@/types";

interface ArticleWithSimilarity extends Article {
  similarity: number;
}

export async function GET(req: NextRequest) {
  const supabase = createClient();
  const { searchParams } = new URL(req.url);

  const cityIds = searchParams.get("city_id");
  const sort = searchParams.get("sort");
  const tags = searchParams.get("tags");
  const searchQuery = searchParams.get("query");

  let query = supabase
    .from("articles")
    .select(
      "id, url, title, image_url, description, tags, city_id, user_id, created_at"
    );

  let articleIdsVec: string[] | null = null;

  if (searchQuery) {
    try {
      const searchQueryStr = searchQuery.replace(/-/g, " ");
      const embedding = await generateEmbeddings(searchQueryStr);

      console.log("Generated Embedding:", embedding);

      const { data: vectorData, error: vectorError } = await supabase.rpc(
        "vector_search",
        {
          query_embedding: embedding, // Pass embedding directly as an array
          threshold: 0.1,
          match_limit: 10,
        }
      );

      if (vectorError) {
        console.error("Vector search error:", vectorError.message);
        return NextResponse.json(
          { error: "Error performing vector search" },
          { status: 500 }
        );
      }

      console.log("Vector Search Result:", vectorData);

      if (vectorData?.length > 0) {
        articleIdsVec = vectorData.map(
          (article: ArticleWithSimilarity) => article.id
        );
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("Embedding error:", errorMessage);
      return NextResponse.json(
        { error: "Error generating embeddings" },
        { status: 500 }
      );
    }
  }

  const cityIdsArray = cityIds ? cityIds.split(",").map((id) => id.trim()) : [];
  const tagsArray = tags ? tags.split(",").map((tag) => Number(tag.trim())) : [];

  // Apply city ID filtering
  if (cityIdsArray.length > 0) {
    query = query.in("city_id", cityIdsArray);
  }

  // Apply tag filtering
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

    const articleIdsTag = articleTags?.map((at) => at.article_id) || [];

    if (articleIdsTag.length > 0) {
      articleIdsVec = articleIdsVec
        ? articleIdsVec.filter((id) => articleIdsTag.includes(id))
        : articleIdsTag;
    } else {
      return NextResponse.json([], { status: 200 });
    }
  }

  // Apply vector search filtering
  if (articleIdsVec && articleIdsVec.length > 0) {
    console.log("Filtered Article IDs after Vector Search:", articleIdsVec);
    query = query.in("id", articleIdsVec);
  }

  // Apply sorting
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
