import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone } = body;

    // 1. Validate inputs
    if (!name?.trim() || !email?.trim() || !phone?.trim()) {
      return NextResponse.json(
        { error: "Name, email, and mobile number are required." },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPhone = phone.trim();
    const trimmedName = name.trim();

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Basic phone validation (at least 7 digits)
    const phoneDigitsCount = trimmedPhone.replace(/\D/g, "").length;
    if (phoneDigitsCount < 7) {
      return NextResponse.json(
        { error: "Please enter a valid mobile number." },
        { status: 400 }
      );
    }

    // 2. Rate limiting check (max 3 requests per 10 minutes)
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { data: recentOtps, error: countError } = await supabase
      .from("otp_codes")
      .select("id")
      .eq("email", trimmedEmail)
      .gte("created_at", tenMinutesAgo);

    if (countError) {
      console.error("Supabase error checking recent OTPs:", countError);
      const isMissingTable = countError.code === 'PGRST205' || countError.code === '42P01';
      if (isMissingTable) {
        return NextResponse.json(
          { error: "Database table 'otp_codes' does not exist. Please run the SQL schema in your Supabase dashboard." },
          { status: 500 }
        );
      }
    } else if (recentOtps && recentOtps.length >= 3) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a few minutes before requesting another code." },
        { status: 429 }
      );
    }

    // 3. Generate a 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes

    // 4. Save to Supabase
    const { error: insertError } = await supabase
      .from("otp_codes")
      .insert([
        {
          email: trimmedEmail,
          phone: trimmedPhone,
          code: otpCode,
          expires_at: expiresAt,
          attempts: 0,
          verified: false,
        },
      ]);

    if (insertError) {
      console.error("Supabase Database Insert Error (otp_codes):", insertError);
      const isMissingTable = insertError.code === 'PGRST205' || insertError.code === '42P01';
      const errorMsg = isMissingTable
        ? "Database table 'otp_codes' does not exist. Please run the SQL schema in your Supabase dashboard."
        : "Failed to generate security code. Please try again.";
      return NextResponse.json(
        { error: errorMsg },
        { status: 500 }
      );
    }

    // 5. Send OTP via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.warn("RESEND_API_KEY is not defined in environment variables. OTP email skipped.");
      // In development, log the code so we can test easily even without key
      console.log(`[DEV ONLY] Generated OTP code for ${trimmedEmail}: ${otpCode}`);
      return NextResponse.json({
        success: true,
        devCode: process.env.NODE_ENV === "development" ? otpCode : undefined,
        warning: "Resend API key is missing. OTP email was not sent.",
      });
    }

    try {
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "Luxura Security <security@luxurafurniture.com>",
          to: trimmedEmail,
          subject: `${otpCode} is your Luxura Private Access Code`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <title>Luxura Verification Code</title>
              <style>
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                  background-color: #0b0b0b;
                  margin: 0;
                  padding: 40px 20px;
                  color: #e5e5e5;
                }
                .container {
                  max-width: 550px;
                  background-color: #121212;
                  margin: 0 auto;
                  border: 1px solid #222222;
                  border-radius: 8px;
                  overflow: hidden;
                  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                }
                .header {
                  background-color: #000000;
                  padding: 40px 40px 30px;
                  text-align: center;
                  border-bottom: 1px solid #1a1a1a;
                }
                .header h1 {
                  color: #d4af37;
                  font-size: 24px;
                  font-weight: 300;
                  letter-spacing: 0.25em;
                  text-transform: uppercase;
                  margin: 0;
                }
                .content {
                  padding: 40px;
                  text-align: center;
                }
                .greeting {
                  font-size: 16px;
                  color: #a3a3a3;
                  margin-bottom: 24px;
                  line-height: 1.5;
                  text-align: left;
                }
                .otp-box {
                  background-color: #181818;
                  border: 1px solid #d4af37;
                  border-radius: 6px;
                  padding: 24px;
                  margin: 32px 0;
                  display: inline-block;
                  letter-spacing: 0.15em;
                }
                .otp-code {
                  font-family: 'Courier New', Courier, monospace;
                  font-size: 36px;
                  font-weight: bold;
                  color: #ffffff;
                  margin: 0;
                }
                .instruction {
                  font-size: 14px;
                  color: #737373;
                  margin-bottom: 32px;
                  line-height: 1.6;
                }
                .footer {
                  background-color: #080808;
                  padding: 24px 40px;
                  text-align: center;
                  border-top: 1px solid #1a1a1a;
                  font-size: 11px;
                  color: #525252;
                  line-height: 1.5;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Luxura</h1>
                </div>
                <div class="content">
                  <div class="greeting">
                    Dear ${trimmedName},<br/><br/>
                    You requested access to the Luxura Private Catalogue. Please use the verification code below to authorize your session.
                  </div>
                  
                  <div class="otp-box">
                    <div class="otp-code">${otpCode}</div>
                  </div>
                  
                  <div class="instruction">
                    This verification code is valid for <strong>5 minutes</strong>.<br/>
                    If you did not request this access, please ignore this email.
                  </div>
                </div>
                <div class="footer">
                  This is a secure automated message from Luxura Furniture.<br/>
                  &copy; ${new Date().getFullYear()} Luxura Furniture. All rights reserved.
                </div>
              </div>
            </body>
            </html>
          `,
        }),
      });

      if (!emailResponse.ok) {
        const errorText = await emailResponse.text();
        console.error("Failed to send OTP email via Resend API:", errorText);
        // Fallback for easy dev/test
        return NextResponse.json({
          success: true,
          devCode: process.env.NODE_ENV === "development" ? otpCode : undefined,
          warning: "Security code generated, but email delivery failed. Please contact support.",
        });
      }
    } catch (emailErr) {
      console.error("Unexpected error calling Resend API for OTP:", emailErr);
      return NextResponse.json({
        success: true,
        devCode: process.env.NODE_ENV === "development" ? otpCode : undefined,
        warning: "Security code generated, but email sending errored.",
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Internal Server Error in /api/otp/send handler:", err);
    return NextResponse.json(
      { error: "An unexpected internal server error occurred." },
      { status: 500 }
    );
  }
}
