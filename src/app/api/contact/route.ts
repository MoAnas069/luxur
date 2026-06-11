import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, details } = body;

    // 1. Validate inputs
    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !details?.trim()) {
      return NextResponse.json(
        { error: "All fields (first name, last name, email, details) are required." },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();

    // 2. Query the RPC function (which runs SECURELY bypassing RLS on server-side)
    const { data: checkData, error: rpcError } = await supabase
      .rpc("check_inquiry_exists", {
        check_email: trimmedEmail,
        check_ip: ip,
        check_time: twoMinutesAgo,
      });

    if (rpcError) {
      console.error("Error executing Supabase RPC check_inquiry_exists:", rpcError);
    } else if (checkData && checkData.length > 0) {
      const { email_exists, ip_rate_limited } = checkData[0];
      
      if (email_exists) {
        return NextResponse.json(
          { error: "An inquiry has already been submitted using this email address." },
          { status: 400 }
        );
      }
      
      if (ip_rate_limited) {
        return NextResponse.json(
          { error: "Too many requests. Please wait a couple minutes before submitting another inquiry." },
          { status: 429 }
        );
      }
    }

    // 4. Insert into Supabase table
    const { error: dbError } = await supabase
      .from("contact_inquiries")
      .insert([
        {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: trimmedEmail,
          details: details.trim(),
          ip_address: ip,
        },
      ]);

    if (dbError) {
      console.error("Supabase Database Insert Error:", dbError);
      return NextResponse.json(
        { error: `Database submission failed: ${dbError.message}` },
        { status: 500 }
      );
    }

    // 3. Send email via Resend API if configured
    const resendApiKey = process.env.RESEND_API_KEY;
    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || "support@luxurafurniture.com";

    if (resendApiKey) {
      try {
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "Luxura Furniture <onboarding@resend.dev>",
            to: receiverEmail,
            subject: `Private Consultation Request - ${firstName} ${lastName}`,
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="utf-8">
                <title>Private Consultation Request</title>
                <style>
                  body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                    background-color: #fafafa;
                    margin: 0;
                    padding: 40px 20px;
                    color: #111111;
                  }
                  .container {
                    max-width: 600px;
                    background-color: #ffffff;
                    margin: 0 auto;
                    border: 1px solid #e0e0e0;
                    border-radius: 4px;
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
                  }
                  .header {
                    background-color: #111111;
                    padding: 30px 40px;
                    text-align: center;
                  }
                  .header h1 {
                    color: #c5a880;
                    font-size: 20px;
                    font-weight: 300;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    margin: 0;
                  }
                  .content {
                    padding: 40px;
                  }
                  .field {
                    margin-bottom: 24px;
                  }
                  .label {
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: #999999;
                    margin-bottom: 6px;
                    font-weight: 600;
                  }
                  .value {
                    font-size: 15px;
                    line-height: 1.6;
                    color: #222222;
                  }
                  .message-box {
                    background-color: #f9f9f9;
                    border-left: 3px solid #c5a880;
                    padding: 20px;
                    margin-top: 8px;
                    font-style: italic;
                    white-space: pre-wrap;
                  }
                  .footer {
                    background-color: #f6f6f6;
                    padding: 20px 40px;
                    text-align: center;
                    border-top: 1px solid #eeeeee;
                    font-size: 11px;
                    color: #888888;
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>Luxura Furniture</h1>
                  </div>
                  <div class="content">
                    <div class="field">
                      <div class="label">Requester Name</div>
                      <div class="value">${firstName} ${lastName}</div>
                    </div>
                    <div class="field">
                      <div class="label">Email Address</div>
                      <div class="value"><a href="mailto:${email}" style="color: #c5a880; text-decoration: none;">${email}</a></div>
                    </div>
                    <div class="field">
                      <div class="label">Project Details & Consultation Requirements</div>
                      <div class="message-box">${details}</div>
                    </div>
                  </div>
                  <div class="footer">
                    Sent automatically from the Luxura Furniture Contact Portal.
                  </div>
                </div>
              </body>
              </html>
            `,
          }),
        });

        if (!emailResponse.ok) {
          const errorText = await emailResponse.text();
          console.error("Failed to send email via Resend API:", errorText);
          // Return success true, but notify that email skipped. It prevents blocking client side flow if DB insert succeeded.
          return NextResponse.json({
            success: true,
            warning: "Inquiry saved to database, but notification email delivery failed.",
          });
        }
      } catch (emailErr) {
        console.error("Unexpected error calling Resend API:", emailErr);
        return NextResponse.json({
          success: true,
          warning: "Inquiry saved to database, but notification email delivery errored.",
        });
      }
    } else {
      console.warn("RESEND_API_KEY is not defined in environment variables. Email notification skipped.");
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Internal Server Error in /api/contact handler:", err);
    return NextResponse.json(
      { error: "An unexpected internal server error occurred." },
      { status: 500 }
    );
  }
}
