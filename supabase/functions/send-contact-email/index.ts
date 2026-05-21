// Supabase Edge Function: send-contact-email
// Deploy: supabase functions deploy send-contact-email --no-verify-jwt
// Required env vars (set in Supabase dashboard → Settings → Edge Functions):
//   RESEND_API_KEY      - your Resend API key (https://resend.com)
//   NOTIFY_TO_EMAIL     - email address that receives contact notifications
//   FROM_EMAIL          - verified sender, e.g. "Portfolio <hello@yourdomain.com>"
//                         (use "onboarding@resend.dev" for testing)

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface Payload {
  name: string;
  email: string;
  message: string;
}

const escape = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const NOTIFY_TO_EMAIL = Deno.env.get("NOTIFY_TO_EMAIL");
    const FROM_EMAIL =
      Deno.env.get("FROM_EMAIL") ?? "Portfolio <onboarding@resend.dev>";

    if (!RESEND_API_KEY || !NOTIFY_TO_EMAIL) {
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const body = (await req.json()) as Partial<Payload>;
    const name = (body.name ?? "").trim();
    const email = (body.email ?? "").trim();
    const message = (body.message ?? "").trim();

    // Validation
    if (!name || name.length > 100) {
      return new Response(JSON.stringify({ error: "Invalid name" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!email || email.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!message || message.length > 5000) {
      return new Response(JSON.stringify({ error: "Invalid message" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1) Notify portfolio owner
    const notifyHtml = `
      <h2>New portfolio contact</h2>
      <p><b>Name:</b> ${escape(name)}</p>
      <p><b>Email:</b> ${escape(email)}</p>
      <p><b>Message:</b></p>
      <pre style="white-space:pre-wrap;font-family:inherit">${escape(message)}</pre>
    `;

    const notifyRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [NOTIFY_TO_EMAIL],
        reply_to: email,
        subject: `Portfolio: new message from ${name}`,
        html: notifyHtml,
      }),
    });

    if (!notifyRes.ok) {
      const text = await notifyRes.text();
      console.error("Resend notify error:", notifyRes.status, text);
      return new Response(
        JSON.stringify({ error: "Email delivery failed" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // 2) Auto-reply to sender (best-effort — don't fail the request)
    const replyHtml = `
      <p>Hi ${escape(name)},</p>
      <p>Thanks for reaching out! I've received your message and will get back to you within a couple of days.</p>
      <p>For reference, here's what you sent:</p>
      <blockquote style="border-left:3px solid #ccc;padding-left:12px;color:#555">${escape(message)}</blockquote>
      <p>— Tejas</p>
    `;
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [email],
        subject: "Thanks for reaching out!",
        html: replyHtml,
      }),
    }).catch((e) => console.warn("auto-reply failed:", e));

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-contact-email error:", err);
    return new Response(JSON.stringify({ error: "Unexpected error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
