import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ids } = body;

    if (ids && Array.isArray(ids) && ids.length > 0) {
      const { error, count } = await supabase
        .from("otp_codes")
        .delete({ count: "exact" })
        .in("id", ids);

      if (error) {
        console.error("Error deleting access log ids:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ success: true, count });
    }

    if (id) {
      const { error, count } = await supabase
        .from("otp_codes")
        .delete({ count: "exact" })
        .eq("id", id);

      if (error) {
        console.error("Error deleting access log id:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ success: true, count });
    }

    return NextResponse.json(
      { error: "Missing id or ids parameter." },
      { status: 400 }
    );
  } catch (err: any) {
    console.error("Server error in /api/access-log/delete:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
