import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

export async function GET(req: NextRequest) {
    const supabase = createClient();

    const { data: tags, error } = await supabase.from('tags').select('*');

    if (error) {
        return NextResponse.json(
            { error: "Error fetching tags!" },
            { status: 500 }
          );
    }
    return NextResponse.json(tags, { status: 200 });
}