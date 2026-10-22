import emailjs from "@emailjs/browser";

// EmailJS configuration — keep IDs in env vars so they're easy to change
const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "";
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "";

// Template IDs
const CONTACT_TEMPLATE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID ?? "";
const WELCOME_TEMPLATE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_WELCOME_TEMPLATE_ID ?? "";
const BUSINESS_TEMPLATE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_BUSINESS_TEMPLATE_ID ?? "";
const TESTER_TEMPLATE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_TESTER_TEMPLATE_ID ?? "";

let initialized = false;

function ensureInit() {
  if (!initialized && PUBLIC_KEY) {
    emailjs.init(PUBLIC_KEY);
    initialized = true;
  }
}

/**
 * Send a contact / general enquiry email via EmailJS.
 */
export async function sendContactEmail(params: {
  from_name: string;
  from_email: string;
  subject: string;
  message: string;
}) {
  if (!SERVICE_ID || !PUBLIC_KEY || !CONTACT_TEMPLATE_ID) return null;
  ensureInit();
  return emailjs.send(SERVICE_ID, CONTACT_TEMPLATE_ID, params);
}

/**
 * Send a welcome email to a newly signed-up user.
 */
export async function sendWelcomeEmail(params: {
  to_name: string;
  to_email: string;
  role: string;
}) {
  if (!SERVICE_ID || !PUBLIC_KEY || !WELCOME_TEMPLATE_ID) return null;
  ensureInit();
  return emailjs.send(SERVICE_ID, WELCOME_TEMPLATE_ID, params);
}

/**
 * Send a business request notification email.
 */
export async function sendBusinessRequestEmail(params: {
  from_name: string;
  from_email: string;
  company: string;
  phone: string;
  test_type: string;
  stage: string;
  target_customer: string;
  decision_question: string;
  additional_info?: string;
}) {
  if (!SERVICE_ID || !PUBLIC_KEY || !BUSINESS_TEMPLATE_ID) return null;
  ensureInit();

  const formattedMessage = [
    `Name: ${params.from_name}`,
    `Business / Brand: ${params.company}`,
    `Email: ${params.from_email}`,
    `Phone: ${params.phone}`,
    `Testing type: ${params.test_type}`,
    `Stage: ${params.stage}`,
    "",
    `Target customer:`,
    params.target_customer,
    "",
    `Decision or question:`,
    params.decision_question,
    "",
    `Additional information:`,
    params.additional_info || "Not provided",
  ].join("\n");

  return emailjs.send(SERVICE_ID, BUSINESS_TEMPLATE_ID, {
    ...params,
    name: params.from_name,
    email: params.from_email,
    subject: "New Testado business test request",
    message: formattedMessage,
  });
}

/**
 * Send a tester application notification email.
 */
export async function sendTesterApplicationEmail(params: {
  from_name: string;
  from_email: string;
  phone: string;
  city: string;
  age: string;
  frequency: string;
  interests?: string;
  why?: string;
}) {
  if (!SERVICE_ID || !PUBLIC_KEY || !TESTER_TEMPLATE_ID) return null;
  ensureInit();

  const formattedMessage = [
    `Name: ${params.from_name}`,
    `Email: ${params.from_email}`,
    `Phone: ${params.phone}`,
    `City: ${params.city}`,
    `Age: ${params.age}`,
    `Testing frequency: ${params.frequency}`,
    "",
    `Interests & background:`,
    params.interests || "Not provided",
    "",
    `Why they want to be a tester:`,
    params.why || "Not provided",
  ].join("\n");

  return emailjs.send(SERVICE_ID, TESTER_TEMPLATE_ID, {
    ...params,
    name: params.from_name,
    email: params.from_email,
    subject: "New Testado tester application",
    message: formattedMessage,
  });
}
