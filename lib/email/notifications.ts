import "server-only";
import { sendEmail } from "./resend";

const STATUS_COPY: Record<string, { label: string; blurb: string }> = {
  in_progress: { label: "In Progress", blurb: "A department team has started working on it." },
  resolved: { label: "Resolved", blurb: "It's been marked resolved. Thank you for reporting it." },
  rejected: { label: "Rejected", blurb: "It was reviewed and rejected as not actionable." },
  duplicate: { label: "Duplicate", blurb: "It's been identified as a duplicate of another report." },
};

function wrapper(bodyHtml: string) {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; color: #1e293b;">
      <div style="padding: 24px 0 16px; border-bottom: 2px solid #2563EB;">
        <span style="font-size: 20px; font-weight: 800; color: #2563EB;">CivicLens</span>
      </div>
      <div style="padding: 24px 0;">
        ${bodyHtml}
      </div>
      <div style="padding: 16px 0; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
        You're receiving this because you reported a civic issue through CivicLens. You can turn these off anytime in Settings.
      </div>
    </div>
  `;
}

export async function sendStatusChangeEmail({
  to,
  issueTitle,
  newStatus,
  department,
  addressText,
  complaintId,
}: {
  to: string | string[];
  issueTitle: string;
  newStatus: string;
  department: string;
  addressText: string | null;
  complaintId: string;
}): Promise<void> {
  const copy = STATUS_COPY[newStatus] ?? { label: newStatus, blurb: "Its status has changed." };

  const html = wrapper(`
    <h2 style="font-size: 16px; margin: 0 0 12px;">Update on your report: ${issueTitle}</h2>
    <p style="font-size: 14px; line-height: 1.6; margin: 0 0 16px;">
      ${copy.blurb}
    </p>
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
      <div style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px;">New Status</div>
      <div style="font-size: 15px; font-weight: 700; color: #2563EB;">${copy.label}</div>
      <div style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin: 12px 0 4px;">Department</div>
      <div style="font-size: 13px; color: #1e293b;">${department}</div>
      ${addressText ? `<div style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin: 12px 0 4px;">Location</div><div style="font-size: 13px; color: #1e293b;">${addressText}</div>` : ""}
    </div>
    <p style="font-size: 11px; color: #94a3b8; font-family: monospace;">Complaint ID: ${complaintId.slice(0, 8)}</p>
  `);

  await sendEmail({ to, subject: `CivicLens: ${issueTitle} is now ${copy.label}`, html });
}

export async function sendNewIssueEmail({
  to,
  issueTitle,
  severity,
  department,
  addressText,
  complaintId,
}: {
  to: string | string[];
  issueTitle: string;
  severity: string | null;
  department: string;
  addressText: string | null;
  complaintId: string;
}): Promise<void> {
  const html = wrapper(`
    <h2 style="font-size: 16px; margin: 0 0 12px;">New report routed to ${department}</h2>
    <p style="font-size: 14px; line-height: 1.6; margin: 0 0 16px;">
      A citizen just reported a new civic issue that's been routed to your department.
    </p>
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
      <div style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px;">Issue</div>
      <div style="font-size: 15px; font-weight: 700; color: #1e293b;">${issueTitle}</div>
      ${severity ? `<div style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin: 12px 0 4px;">Severity</div><div style="font-size: 13px; color: #1e293b; text-transform: capitalize;">${severity}</div>` : ""}
      ${addressText ? `<div style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin: 12px 0 4px;">Location</div><div style="font-size: 13px; color: #1e293b;">${addressText}</div>` : ""}
    </div>
    <p style="font-size: 11px; color: #94a3b8; font-family: monospace;">Complaint ID: ${complaintId.slice(0, 8)}</p>
  `);

  await sendEmail({ to, subject: `CivicLens: New ${severity ?? ""} issue - ${issueTitle}`, html });
}

export async function sendSupportTicketEmail({
  to,
  fromName,
  fromEmail,
  message,
}: {
  to: string | string[];
  fromName: string;
  fromEmail: string;
  message: string;
}): Promise<void> {
  const html = wrapper(`
    <h2 style="font-size: 16px; margin: 0 0 12px;">New support ticket</h2>
    <p style="font-size: 13px; color: #64748b; margin: 0 0 12px;">From ${fromName} (${fromEmail})</p>
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; white-space: pre-wrap; font-size: 14px; line-height: 1.6;">
      ${message}
    </div>
  `);

  await sendEmail({ to, subject: `CivicLens support ticket from ${fromName}`, html });
}
