import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface SubscribeRequest {
  email: string;
  source?: string;
  full_name?: string;
  company?: string;
  job_role?: string;
  linkedin_profile?: string;
  role_type?: string;
  is_cambridge_alum?: boolean;
}

interface UnsubscribeRequest {
  email: string;
}

async function sendEmail(to: string, subject: string, body: string): Promise<{ ok: boolean; error?: string }> {
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!resendKey) {
    console.error("RESEND_API_KEY is not set");
    return { ok: false, error: "RESEND_API_KEY not configured" };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Cambridge ETA Club <onboarding@resend.dev>",
      to: [to],
      subject,
      text: body,
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    console.error("Resend error:", res.status, errBody);
    return { ok: false, error: errBody };
  }

  return { ok: true };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const action = url.searchParams.get("action") || "subscribe";

    if (req.method === "POST") {
      if (action === "subscribe") {
        const {
          email,
          source,
          full_name,
          company,
          job_role,
          linkedin_profile,
          role_type,
          is_cambridge_alum
        }: SubscribeRequest = await req.json();

        if (!email || !email.includes("@")) {
          return new Response(
            JSON.stringify({ error: "Invalid email address" }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        const { data, error } = await supabase
          .from("newsletter_subscribers")
          .insert([{
            email,
            source: source || "website",
            full_name,
            company,
            job_role,
            linkedin_profile,
            role_type,
            is_cambridge_alum: is_cambridge_alum || false,
          }])
          .select();

        if (error) {
          console.error("Supabase insert error:", error);
          if (error.code === "23505") {
            return new Response(
              JSON.stringify({
                success: true,
                message: "Already subscribed",
                isNewSubscriber: false,
              }),
              {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
              }
            );
          }
          throw error;
        }

        const { data: emailSettings } = await supabase
          .from("email_settings")
          .select("subject, body, admin_notification_email")
          .eq("key", "welcome_email")
          .maybeSingle();

        if (emailSettings) {
          const displayName = full_name || email;

          const personalizedBody = emailSettings.body
            .replace(/\{\{full_name\}\}/g, displayName)
            .replace(/\{\{email\}\}/g, email);

          EdgeRuntime.waitUntil(sendEmail(email, emailSettings.subject, personalizedBody));

          if (emailSettings.admin_notification_email) {
            const adminSubject = `New signup: ${displayName}`;
            const adminBody = `A new person joined the Cambridge ETA community.

Name: ${full_name || "Not provided"}
Email: ${email}
Source: ${source || "website"}
Company: ${company || "Not provided"}
Job Role: ${job_role || "Not provided"}
Role Type: ${role_type || "Not provided"}
Cambridge Alum: ${is_cambridge_alum ? "Yes" : "No"}`;

            EdgeRuntime.waitUntil(
              sendEmail(emailSettings.admin_notification_email, adminSubject, adminBody)
            );
          }
        }

        return new Response(
          JSON.stringify({
            success: true,
            message: "Successfully subscribed to mailing list",
            isNewSubscriber: true,
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      } else if (action === "unsubscribe") {
        const { email }: UnsubscribeRequest = await req.json();

        if (!email || !email.includes("@")) {
          return new Response(
            JSON.stringify({ error: "Invalid email address" }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        const { error } = await supabase
          .from("newsletter_subscribers")
          .delete()
          .eq("email", email);

        if (error) throw error;

        return new Response(
          JSON.stringify({
            success: true,
            message: "Successfully unsubscribed from mailing list",
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    return new Response(
      JSON.stringify({ error: "Invalid request" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
