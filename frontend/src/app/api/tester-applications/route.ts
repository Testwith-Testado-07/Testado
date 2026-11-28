import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

import { guardPublicForm } from "@/lib/spam-guard";

export const runtime = "nodejs";

const allowedAgeRanges = new Set(["18–24", "25–34", "35–44", "45+"]);
const allowedFrequencies = new Set([
  "Whenever a suitable opportunity comes up",
  "A few times a month",
  "Occasionally",
]);

function readText(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const text = value.trim();
  return text.length > 0 && text.length <= maxLength ? text : null;
}

function readOptionalText(value: unknown, maxLength: number): string | null {
  if (value === undefined || value === null || value === "") return "";
  if (typeof value !== "string") return null;
  const text = value.trim();
  return text.length <= maxLength ? text : null;
}

function readRecipients(value: string | undefined): string[] {
  if (!value) return [];

  return value
    .split(",")
    .map((recipient) => recipient.trim())
    .filter((recipient) => recipient.length > 0);
}

/** Stores the application with the server-only key. Returns false if it couldn't be saved. */
async function saveApplication(row: Record<string, string>): Promise<boolean> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    console.warn("Tester application not saved: Supabase is not configured.");
    return false;
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { error } = await supabase.from("tester_applications").insert(row);
  if (error) {
    console.error("Tester application not saved:", error.message);
    return false;
  }
  return true;
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 16_384) {
    return Response.json({ error: "Application is too large." }, { status: 413 });
  }

  const payload: unknown = await request.json().catch(() => null);
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return Response.json({ error: "Invalid application." }, { status: 400 });
  }

  const body = payload as Record<string, unknown>;
  const blocked = await guardPublicForm(request, body, "tester-application");
  if (blocked) return blocked;

  const name = readText(body.name, 120);
  const phone = readText(body.phone, 50);
  const email = readText(body.email, 254);
  const city = readText(body.city, 120);
  const age = readText(body.age, 20);
  const frequency = readText(body.frequency, 80);
  const interests = readOptionalText(body.interests, 1000);
  const why = readOptionalText(body.why, 2000);

  if (
    !name ||
    !phone ||
    !email ||
    !city ||
    !age ||
    !frequency ||
    interests === null ||
    why === null
  ) {
    return Response.json({ error: "Please check the required application fields." }, { status: 400 });
  }

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !allowedAgeRanges.has(age) ||
    !allowedFrequencies.has(frequency)
  ) {
    return Response.json({ error: "Please check your email, age range, and testing frequency." }, { status: 400 });
  }

  // Save first so the application isn't lost if email delivery fails.
  const saved = await saveApplication({
    name,
    phone,
    email,
    city,
    age_range: age,
    frequency,
    interests,
    why,
  });

  const apiKey = process.env.RESEND_API_KEY;
  const recipients = readRecipients(process.env.BUSINESS_REQUEST_TO_EMAIL);
  const sender = process.env.BUSINESS_REQUEST_FROM_EMAIL?.replace(/^["']|["']$/g, "").trim();

  if (!apiKey || recipients.length === 0 || !sender) {
    if (saved) return Response.json({ ok: true });
    return Response.json({ error: "Email delivery is not configured." }, { status: 503 });
  }

  const message = [
    "New Testado tester application",
    "",
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Email: ${email}`,
    `City: ${city}`,
    `Age range: ${age}`,
    `Testing frequency: ${frequency}`,
    `Interests: ${interests || "Not provided"}`,
    `Why they want to test:\n${why || "Not provided"}`,
  ].join("\n");

  try {
    const resend = new Resend(apiKey);
    const send = (to: string[]) =>
      resend.emails.send({
        from: sender,
        to,
        replyTo: email,
        subject: "New Testado tester application",
        text: message,
      });

    const { error } = await send(recipients);

    if (error) {
      // Resend's test sender rejects the whole send if any recipient isn't the account owner,
      // so retry one by one and count it delivered if any inbox got it.
      let anyDelivered = false;
      for (const recipient of recipients) {
        const single = await send([recipient]).catch(() => null);
        if (single && !single.error) anyDelivered = true;
        else console.warn("Tester application not delivered to one recipient:", single?.error?.message);
      }

      if (!anyDelivered) {
        console.error("Tester application email delivery failed:", error.message);
        if (saved) return Response.json({ ok: true });
        return Response.json({ error: "We couldn't deliver your application. Please try again later." }, { status: 502 });
      }
    }
  } catch (error: unknown) {
    console.error(
      "Tester application email delivery failed:",
      error instanceof Error ? error.message : error
    );
    if (saved) return Response.json({ ok: true });
    return Response.json({ error: "We couldn't deliver your application. Please try again later." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
