import { createClient } from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest
) {
  const supabase = createClient();

  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  const { data, error } = await supabase
    .from("cities")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching city:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
