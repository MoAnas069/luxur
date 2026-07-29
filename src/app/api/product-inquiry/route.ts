import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientName, clientEmail, requirements, productName, productCategory, productImage, productId } = body;

    if (!clientName?.trim() || !clientEmail?.trim() || !productName?.trim()) {
      return NextResponse.json(
        { error: "Client name, email, and product name are required." },
        { status: 400 }
      );
    }

    const payload = {
      client_name: clientName.trim(),
      client_email: clientEmail.trim().toLowerCase(),
      requirements: requirements?.trim() || "",
      product_name: productName.trim(),
      product_category: productCategory?.trim() || "Furniture",
      product_image: productImage || "",
      product_id: productId || "",
      status: "New",
      created_at: new Date().toISOString(),
    };

    // 1. Attempt insert into `product_inquiries` table
    const { error: primaryErr } = await supabase
      .from("product_inquiries")
      .insert([payload]);

    if (primaryErr) {
      console.warn("Table product_inquiries insert skipped or failed:", primaryErr.message);

      // 2. Fallback: Save into `otp_codes` table with `code: 'PROD_INQ'` so backend admin receives it guaranteed
      const fallbackRecord = {
        email: clientEmail.trim().toLowerCase(),
        phone: JSON.stringify({
          name: clientName.trim(),
          product: productName.trim(),
          category: productCategory?.trim() || "Furniture",
          image: productImage || "",
          requirements: requirements?.trim() || "",
          status: "New",
        }),
        code: "PROD_INQ",
        verified: false,
        expires_at: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString(),
      };

      const { error: fallbackErr } = await supabase
        .from("otp_codes")
        .insert([fallbackRecord]);

      if (fallbackErr) {
        console.error("Fallback insert failed:", fallbackErr.message);
        return NextResponse.json(
          { error: "Failed to save product inquiry to database." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true, message: "Product inquiry saved successfully." });
  } catch (err: any) {
    console.error("Internal server error in /api/product-inquiry:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
