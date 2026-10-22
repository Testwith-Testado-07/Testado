import { Resend } from "resend";

export const runtime = "nodejs";

const allowedTestTypes = new Set(["Product", "Physical Product", "Service", "Idea", "Concept"]);
const allowedStages = new Set([
    "Concept / Idea",
    "Prototype / MVP",
    "Ready to launch",
    "Already launched (Optimizing)",
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
        return Response.json({ error: "Request is too large." }, { status: 413 });
    }

    const payload: unknown = await request.json().catch(() => null);
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
        return Response.json({ error: "Invalid request." }, { status: 400 });
    }

    const body = payload as Record<string, unknown>;
    const name = readText(body.name, 120);
    const company = readText(body.company, 160);
    const email = readText(body.email, 254);
    const phone = readText(body.phone, 50);
    const testType = readText(body.testType, 40);
    const stage = readText(body.stage, 40);
    const targetCustomer = readText(body.targetCustomer, 2000);
    const decisionQuestion = readText(body.decisionQuestion, 2000);
    const additionalInfo = readOptionalText(body.additionalInfo, 3000);

    if (
        !name ||
        !company ||
        !email ||
        !phone ||
        !testType ||
        !stage ||
        !targetCustomer ||
        !decisionQuestion ||
        additionalInfo === null ||
        body.consent !== true
    ) {
        return Response.json({ error: "Please check the required form fields." }, { status: 400 });
    }

    if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        !allowedTestTypes.has(testType) ||
        !allowedStages.has(stage)
    ) {
        return Response.json({ error: "Please check the email, testing type, and stage." }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const recipients = readRecipients(process.env.BUSINESS_REQUEST_TO_EMAIL);
    const sender = process.env.BUSINESS_REQUEST_FROM_EMAIL?.replace(/^["']|["']$/g, "").trim();

    if (!apiKey || recipients.length === 0 || !sender) {
        return Response.json({ error: "Email delivery is not configured." }, { status: 503 });
    }

    const message = [
        "New business test request",
        "",
        `Name: ${name}`,
        `Business / Brand: ${company}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        `Testing type: ${testType}`,
        `Stage: ${stage}`,
        "",
        `Target customer:\n${targetCustomer}`,
        `Decision or question:\n${decisionQuestion}`,
        `Additional information:\n${additionalInfo || "Not provided"}`,
    ].join("\n");

    const resend = new Resend(apiKey);
    try {
        const { error } = await resend.emails.send({
            from: sender,
            to: recipients,
            replyTo: email,
            subject: "New Testado business test request",
            text: message,
        });

        if (error) {
            // If batch send fails (e.g. Resend sandbox restrictions on non-owner emails),
            // attempt each recipient individually so delivered emails still go through.
            let anyDelivered = false;
            let lastErrorMessage = error.message;

            for (const recipient of recipients) {
                try {
                    const single = await resend.emails.send({
                        from: sender,
                        to: [recipient],
                        replyTo: email,
                        subject: "New Testado business test request",
                        text: message,
                    });

                    if (!single.error) {
                        anyDelivered = true;
                    } else {
                        console.warn(`Could not deliver business request to ${recipient}: ${single.error.message}`);
                        lastErrorMessage = single.error.message;
                    }
                } catch (sendErr) {
                    console.warn(`Failed sending to ${recipient}:`, sendErr);
                }
            }

            if (!anyDelivered) {
                return Response.json({ error: lastErrorMessage || "Email delivery failed." }, { status: 502 });
            }
        }
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Email delivery failed.";
        console.error("Business request email delivery failed:", message);
        return Response.json({ error: message }, { status: 502 });
    }

    return Response.json({ ok: true });
}