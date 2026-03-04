import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  
  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Stax <onboarding@resend.dev>",
        to: [email],
        subject: "You're on the Stax waitlist! 🔥",
        html: `
          <div style="background:#080808;padding:40px;font-family:sans-serif;color:#fff;max-width:500px;margin:0 auto;border-radius:16px;">
            <h1 style="background:linear-gradient(135deg,#FF6B35,#FFD23F);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-size:32px;margin-bottom:8px;">STAX</h1>
            <h2 style="color:#fff;margin-bottom:16px;">You're on the list! 🎉</h2>
            <p style="color:rgba(255,255,255,.6);line-height:1.7;margin-bottom:24px;">
              Thanks for joining the Stax waitlist. We're building something special — 
              the smartest AI tool finder on the internet.
            </p>
            <p style="color:rgba(255,255,255,.6);line-height:1.7;margin-bottom:32px;">
              You'll be first to know when Stax Pro launches with saved stacks, 
              weekly tool updates, and cost comparisons.
            </p>
            <a href="https://getstax.ai" style="background:linear-gradient(135deg,#FF6B35,#FFD23F);color:#080808;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:800;font-size:16px;">
              Build Your Stack Now →
            </a>
            <p style="color:rgba(255,255,255,.3);font-size:12px;margin-top:32px;">
              getstax.ai · Find your perfect AI stack
            </p>
          </div>
        `,
      }),
    });

    // Also notify yourself
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Stax <onboarding@resend.dev>",
        to: ["83tlog@gmail.com"],
        subject: `🔥 New Stax waitlist signup: ${email}`,
        html: `<p>New signup: <strong>${email}</strong></p>`,
      }),
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}