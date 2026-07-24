import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code } = body;

    // 1. Validate inputs
    if (!email?.trim() || !code?.trim()) {
      return NextResponse.json(
        { error: "Email and verification code are required." },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedCode = code.trim();

    // 2. Fetch the latest unverified OTP code for this email
    const { data: records, error: fetchError } = await supabase
      .from("otp_codes")
      .select("*")
      .eq("email", trimmedEmail)
      .eq("verified", false)
      .order("created_at", { ascending: false })
      .limit(1);

    if (fetchError) {
      console.error("Supabase error fetching OTP code:", fetchError);
      const isMissingTable = fetchError.code === 'PGRST205' || fetchError.code === '42P01';
      const errorMsg = isMissingTable
        ? "Database table 'otp_codes' does not exist. Please run the SQL schema in your Supabase dashboard."
        : "Database error verifying code. Please try again.";
      return NextResponse.json(
        { error: errorMsg },
        { status: 500 }
      );
    }

    if (!records || records.length === 0) {
      return NextResponse.json(
        { error: "No active verification request found. Please request a new code." },
        { status: 400 }
      );
    }

    const record = records[0];

    // 3. Check if OTP is expired
    const isExpired = new Date(record.expires_at).getTime() < Date.now();
    if (isExpired) {
      return NextResponse.json(
        { error: "The verification code has expired. Please request a new code." },
        { status: 400 }
      );
    }

    // 4. Check if too many attempts
    const currentAttempts = (record.attempts || 0) + 1;
    
    // Update attempts in DB first
    const { error: updateAttemptsError } = await supabase
      .from("otp_codes")
      .update({ attempts: currentAttempts })
      .eq("id", record.id);

    if (updateAttemptsError) {
      console.error("Supabase error updating OTP attempts:", updateAttemptsError);
    }

    if (currentAttempts > 3) {
      return NextResponse.json(
        { error: "Too many incorrect attempts. Please request a new code." },
        { status: 400 }
      );
    }

    // 5. Compare verification code
    if (record.code !== trimmedCode) {
      const remaining = 3 - currentAttempts;
      const errorMsg = remaining > 0
        ? `Incorrect verification code. You have ${remaining} ${remaining === 1 ? 'attempt' : 'attempts'} remaining.`
        : "Incorrect verification code. Too many incorrect attempts. Please request a new code.";
      return NextResponse.json(
        { error: errorMsg },
        { status: 400 }
      );
    }

    // 6. Verification Success - Mark as verified
    const { error: verifyError } = await supabase
      .from("otp_codes")
      .update({ verified: true })
      .eq("id", record.id);

    if (verifyError) {
      console.error("Supabase error marking OTP as verified:", verifyError);
      return NextResponse.json(
        { error: "Failed to complete verification. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Internal Server Error in /api/otp/verify handler:", err);
    return NextResponse.json(
      { error: "An unexpected internal server error occurred." },
      { status: 500 }
    );
  }
}
