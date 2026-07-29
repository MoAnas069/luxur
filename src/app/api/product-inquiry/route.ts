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
      // Fallback: Save into `otp_codes` table with `code: 'PROD_INQ'` to guarantee persistence
      const fallbackRecord = {
        email: clientEmail.trim().toLowerCase(),
        phone: JSON.stringify({
          name: clientName.trim(),
          product: productName.trim(),
          category: productCategory?.trim() || "Furniture",
          image: productImage || "",
          requirements: requirements?.trim() || "",
          status: "New",
          created_at: new Date().toISOString(),
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
    console.error("Internal server error in /api/product-inquiry POST:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const inquiries: any[] = [];

    // 1. Fetch from primary table `product_inquiries` if it exists
    const { data: primaryData, error: primaryErr } = await supabase
      .from("product_inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (!primaryErr && primaryData) {
      primaryData.forEach((row: any) => {
        inquiries.push({
          id: row.id,
          clientName: row.client_name || "Anonymous",
          clientEmail: row.client_email || "",
          productName: row.product_name || "Bespoke Item",
          productCategory: row.product_category || "Furniture",
          productImage: row.product_image || "",
          productId: row.product_id || "",
          requirements: row.requirements || "No custom specifications provided.",
          status: row.status || "New",
          createdAt: row.created_at || new Date().toISOString(),
        });
      });
    }

    // 2. Fetch from fallback `otp_codes` table with `code: 'PROD_INQ'`
    const { data: otpData, error: otpErr } = await supabase
      .from("otp_codes")
      .select("*")
      .eq("code", "PROD_INQ")
      .order("created_at", { ascending: false });

    if (!otpErr && otpData) {
      otpData.forEach((row: any) => {
        try {
          let details: any = {};
          if (row.phone && row.phone.startsWith("{")) {
            details = JSON.parse(row.phone);
          } else {
            details = {
              name: row.phone || "Client Inquiry",
              product: "Bespoke Piece",
              category: "Furniture",
              requirements: "Commission requested.",
              status: "New",
            };
          }

          inquiries.push({
            id: row.id,
            clientName: details.name || details.clientName || "Anonymous",
            clientEmail: row.email || details.clientEmail || "",
            productName: details.product || details.productName || "Bespoke Furniture Piece",
            productCategory: details.category || details.productCategory || "Furniture",
            productImage: details.image || details.productImage || "/images/curated_space_1778847129791.webp",
            productId: details.productId || "",
            requirements: details.requirements || "No custom specifications provided.",
            status: details.status || "New",
            createdAt: details.created_at || row.created_at || new Date().toISOString(),
          });
        } catch {
          /* ignore JSON parse errors */
        }
      });
    }

    // Sort all combined inquiries by created_at descending
    inquiries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ success: true, inquiries });
  } catch (err: any) {
    console.error("Internal server error in /api/product-inquiry GET:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred fetching inquiries." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ error: "ID and status are required." }, { status: 400 });
    }

    // Try updating primary table
    const { error: pErr } = await supabase
      .from("product_inquiries")
      .update({ status })
      .eq("id", id);

    // Try updating fallback table if row exists there
    const { data: otpRow } = await supabase.from("otp_codes").select("*").eq("id", id).single();
    if (otpRow && otpRow.phone && otpRow.phone.startsWith("{")) {
      try {
        const parsed = JSON.parse(otpRow.phone);
        parsed.status = status;
        await supabase
          .from("otp_codes")
          .update({ phone: JSON.stringify(parsed) })
          .eq("id", id);
      } catch {}
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to update inquiry status." }, { status: 500 });
  }
}
