import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

type PublicForm = "business-request" | "tester-application";

const MAX_PER_WINDOW = 5;
const WINDOW_SECONDS = 60 * 60;
const MIN_FILL_MS = 3000;

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}

/**
 * Bot and flood protection for the public forms. Returns a response to send back when the
 * submission should not be delivered, or null when it may go through.
 *
 * Bots that fill the hidden `website` field or submit faster than a person can are told it
 * worked, so they don't adapt. Real senders over the limit get a 429. If the rate-limit check
 * itself fails (e.g. the migration hasn't run), the form stays usable.
 */
export async function guardPublicForm(
  request: Request,
  body: Record<string, unknown>,
  form: PublicForm
): Promise<Response | null> {
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return Response.json({ ok: true });
  }

  if (typeof body.startedAt === "number" && Date.now() - body.startedAt < MIN_FILL_MS) {
    return Response.json({ ok: true });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.warn("Form rate limiting skipped: Supabase is not configured.");
    return null;
  }

  const ipHash = createHash("sha256").update(`testado-forms:${clientIp(request)}`).digest("hex");
  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { data: allowed, error } = await supabase.rpc("check_form_rate_limit", {
    p_form: form,
    p_ip_hash: ipHash,
    p_max: MAX_PER_WINDOW,
    p_window_seconds: WINDOW_SECONDS,
  });

  if (error) {
    console.warn("Form rate limiting unavailable:", error.message);
    return null;
  }

  if (allowed === false) {
    return Response.json(
      { error: "You've sent several requests in a short time. Please try again in an hour." },
      { status: 429 }
    );
  }

  return null;
}
