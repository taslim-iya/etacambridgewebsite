import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RegistrationRequest {
  event_id: string;
  full_name: string;
  email: string;
  role: string;
  notes?: string;
}

async function sendEmail(to: string, subject: string, body: string): Promise<void> {
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!resendKey) {
    console.error("RESEND_API_KEY is not set");
    return;
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
  }
}

const roleLabels: Record<string, string> = {
  mba_student: "MBA Student",
  phd_student: "PhD / Research",
  alumni: "Cambridge Alumni",
  searcher: "Active Searcher",
  investor: "ETA Investor",
  operator: "Operator / Acquired CEO",
  advisor: "Deal Advisor",
  external: "External / Other",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { event_id, full_name, email, role, notes }: RegistrationRequest = await req.json();

    if (!event_id || !full_name || !email || !role) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { error: insertError } = await supabase.from("event_registrations").insert([{
      event_id,
      full_name: full_name.trim(),
      email: email.trim().toLowerCase(),
      role,
      notes: notes?.trim() || "",
    }]);

    if (insertError) {
      if (insertError.code === "23505") {
        return new Response(
          JSON.stringify({ success: false, duplicate: true, error: "You have already registered for this event with that email address." }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw insertError;
    }

    const { data: event } = await supabase
      .from("events")
      .select("title, date, location, event_type")
      .eq("id", event_id)
      .maybeSingle();

    const { data: emailSettings } = await supabase
      .from("email_settings")
      .select("admin_notification_email")
      .eq("key", "welcome_email")
      .maybeSingle();

    if (event) {
      const eventDate = event.date
        ? new Date(event.date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
        : "TBC";
      const eventTime = event.date
        ? new Date(event.date).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
        : "";
      const dateStr = eventTime ? `${eventDate} at ${eventTime}` : eventDate;

      const confirmationSubject = `Registration confirmed: ${event.title}`;
      const confirmationBody = `Hi ${full_name},

Your registration for ${event.title} has been confirmed.

Event details:
- Date: ${dateStr}${event.location ? `\n- Location: ${event.location}` : ""}

We look forward to seeing you there. If you have any questions, please don't hesitate to reach out.

Best regards,
The Cambridge ETA Team`;

      EdgeRuntime.waitUntil(sendEmail(email, confirmationSubject, confirmationBody));

      if (emailSettings?.admin_notification_email) {
        const adminSubject = `New event registration: ${event.title}`;
        const adminBody = `A new registration has been received for ${event.title}.

Name: ${full_name}
Email: ${email}
Role: ${roleLabels[role] ?? role}${notes ? `\nNotes: ${notes}` : ""}

Event: ${event.title}
Date: ${dateStr}`;

        EdgeRuntime.waitUntil(sendEmail(emailSettings.admin_notification_email, adminSubject, adminBody));
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
