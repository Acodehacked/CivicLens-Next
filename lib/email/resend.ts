import "server-only";
import { Resend } from "resend";

// Falls back to Resend's own sandbox sender if no custom domain has been
// verified yet - works out of the box, but Resend restricts sandbox
// deliverability, so set RESEND_FROM_EMAIL once a domain is verified.
const FROM_ADDRESS = process.env.RESEND_FROM_EMAIL || "CivicLens <onboarding@resend.dev>";

let client: Resend | null = null;

function getClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!client) client = new Resend(process.env.RESEND_API_KEY);
  return client;
}

// Email is always supplementary, never on the critical path: a failed send
// is logged and swallowed here so it can never break a status update or a
// report submission.
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string | string[];
  subject: string;
  html: string;
}): Promise<void> {
  const resend = getClient();

  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set - skipping email:", subject);
    return;
  }

  try {
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject,
      html,
    });
    if (error) {
      console.error("[email] Resend rejected the send:", error);
    }
  } catch (err) {
    console.error("[email] send failed:", err);
  }
}
