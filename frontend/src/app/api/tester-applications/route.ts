import { Resend } from "resend";

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
    why === null ||
    body.consent !== true
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

  const apiKey = process.env.RESEND_API_KEY;
  const recipients = readRecipients(process.env.BUSINESS_REQUEST_TO_EMAIL);
  const sender = process.env.BUSINESS_REQUEST_FROM_EMAIL?.replace(/^["']|["']$/g, "").trim();

  if (!apiKey || recipients.length === 0 || !sender) {
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
    const { error } = await new Resend(apiKey).emails.send({
      from: sender,
      to: recipients,
      replyTo: email,
      subject: "New Testado tester application",
      text: message,
    });

    if (error) {
      console.error("Tester application email delivery failed:", error.message);
      return Response.json({ error: "We couldn't deliver your application. Please try again later." }, { status: 502 });
    }
  } catch (error: unknown) {
    console.error(
      "Tester application email delivery failed:",
      error instanceof Error ? error.message : error
    );
    return Response.json({ error: "We couldn't deliver your application. Please try again later." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
