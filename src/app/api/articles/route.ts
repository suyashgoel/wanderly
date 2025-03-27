import { createClient } from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = createClient();
  const { searchParams } = new URL(req.url);
  const city_id = searchParams.get("city_id");

  const query = supabase.from("articles").select("*");

  const { data: articles, error } = city_id
    ? await query.eq("city_id", city_id)
    : await query;

  if (error) {
    console.error("Error fetching articles:", error.message);
    return NextResponse.json({ error: "Error fetching articles" }, { status: 500 });
  }

  return NextResponse.json(articles, { status: 200 });
}
