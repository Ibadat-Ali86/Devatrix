import "server-only";

import nodemailer from "nodemailer";

export type EmailAttachment = {
  filename: string;
  content: Buffer;
  contentType?: string;
};

export type MailSendInput = {
  to: string;
  subject: string;
  text: string;
  html: string;
  attachments?: EmailAttachment[];
  idempotencyKey?: string;
};

export type MailSendResult = {
  sent: boolean;
  provider: "smtp" | "resend" | "none";
  error?: string;
};

export function getMailerMode(): "smtp" | "resend" | "none" {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return "smtp";
  }
  if (process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL) {
    return "resend";
  }
  return "none";
}

export function isMailerConfigured(): boolean {
  return getMailerMode() !== "none";
}

export async function sendDevatrixEmail(input: MailSendInput): Promise<MailSendResult> {
  const mode = getMailerMode();

  if (mode === "smtp") {
    try {
      const host = process.env.SMTP_HOST!;
      const port = Number(process.env.SMTP_PORT || 465);
      const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465;
      const user = process.env.SMTP_USER!;
      const pass = process.env.SMTP_PASS!;
      const from = process.env.SMTP_FROM || `Devatrix Technologies <${user}>`;

      const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
      });

      await transporter.sendMail({
        from,
        to: input.to,
        subject: input.subject,
        text: input.text,
        html: input.html,
        attachments: (input.attachments ?? []).map((att) => ({
          filename: att.filename,
          content: att.content,
          contentType: att.contentType || "application/pdf",
        })),
      });

      return { sent: true, provider: "smtp" };
    } catch (err) {
      const message = err instanceof Error ? err.message : "SMTP delivery failed";
      console.error("[Devatrix Mailer] SMTP send error:", message);
      return { sent: false, provider: "smtp", error: message };
    }
  }

  if (mode === "resend") {
    try {
      const apiKey = process.env.RESEND_API_KEY!;
      const from = process.env.RESEND_FROM_EMAIL!;
      const headers: Record<string, string> = {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      };
      if (input.idempotencyKey) {
        headers["Idempotency-Key"] = input.idempotencyKey;
      }

      const payload: Record<string, unknown> = {
        from,
        to: [input.to],
        subject: input.subject,
        text: input.text,
        html: input.html,
      };
      if (input.attachments?.length) {
        payload.attachments = input.attachments.map((att) => ({
          filename: att.filename,
          content: att.content.toString("base64"),
        }));
      }

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(15_000),
      });

      if (!res.ok) {
        const errBody = await res.text().catch(() => "");
        return { sent: false, provider: "resend", error: `Resend HTTP ${res.status}: ${errBody.slice(0, 200)}` };
      }

      return { sent: true, provider: "resend" };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Resend delivery failed";
      console.error("[Devatrix Mailer] Resend send error:", message);
      return { sent: false, provider: "resend", error: message };
    }
  }

  return {
    sent: false,
    provider: "none",
    error: "No email provider configured. Add SMTP_HOST/SMTP_USER/SMTP_PASS (Company Mail) or RESEND_API_KEY in .env.local.",
  };
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch] ?? ch);
}

export type OfferEmailTemplateInput = {
  fullName: string;
  track: string;
  startDate: string;
  endDate: string;
  studentEmail: string;
  trackingCode: string;
  setupUrl: string | null;
  portalSignInUrl: string;
  whatsappGroupUrl?: string;
};

/**
 * Clean, concise, executive HR email format (no flashy marketing boxes, generous spacing).
 */
export function buildOfferEmail(input: OfferEmailTemplateInput): { subject: string; text: string; html: string } {
  const subject = `${input.track} – Internship Offer Letter | Devatrix Technologies`;
  const portalLineText = input.setupUrl
    ? `Activate Your Learner Portal Account:\n${input.setupUrl}`
    : `Access Your Learner Portal:\n${input.portalSignInUrl}`;
  const whatsappUrl = input.whatsappGroupUrl?.trim() || "https://wa.me/923156179410";
  const whatsappText = `Join Interns WhatsApp Group Here:\n${whatsappUrl}`;

  const text = [
    `Dear ${input.fullName},`,
    "",
    `We are pleased to inform you that you have been selected for the REMOTE ${input.track} Internship Program at Devatrix Technologies. This 6-week online internship will be conducted from ${input.startDate} to ${input.endDate}. Kindly review your Internship Offer Letter attached with this email and activate your Learner Portal account at your earliest convenience.`,
    "",
    portalLineText,
    "",
    `Portal Login Email: ${input.studentEmail}`,
    `Candidate Reference ID: ${input.trackingCode}`,
    "",
    whatsappText,
    "",
    "We look forward to a rewarding learning journey with you.",
    "",
    "Best Regards,",
    "Devatrix Technologies",
  ].join("\n");

  const safeName = escapeHtml(input.fullName);
  const safeTrack = escapeHtml(input.track);
  const safeStart = escapeHtml(input.startDate);
  const safeEnd = escapeHtml(input.endDate);
  const safeEmail = escapeHtml(input.studentEmail);
  const safeCode = escapeHtml(input.trackingCode);
  const actionUrl = escapeHtml(input.setupUrl || input.portalSignInUrl);
  const actionLabel = input.setupUrl ? "Activate Your Learner Portal Account:" : "Access Your Learner Portal:";
  const safeWhatsapp = escapeHtml(whatsappUrl);
  const whatsappHtml = `<p style="margin:0 0 16px 0;">Join Interns WhatsApp Group Here:<br/><a href="${safeWhatsapp}" style="color:#1155cc;">${safeWhatsapp}</a></p>`;

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#222222;width:100%;">
<p style="margin:0 0 16px 0;">Dear ${safeName},</p>
<p style="margin:0 0 16px 0;">We are pleased to inform you that you have been selected for the REMOTE <strong>${safeTrack}</strong> Internship Program at Devatrix Technologies. This 6-week online internship will be conducted from ${safeStart} to ${safeEnd}. Kindly review your Internship Offer Letter attached with this email and activate your Learner Portal account at your earliest convenience.</p>
<p style="margin:0 0 16px 0;">${actionLabel}<br/><a href="${actionUrl}" style="color:#1155cc;word-break:break-all;">${actionUrl}</a></p>
<p style="margin:0 0 16px 0;">Portal Login Email: ${safeEmail}<br/>Candidate Reference ID: <strong>${safeCode}</strong></p>
${whatsappHtml}
<p style="margin:0 0 16px 0;">We look forward to a rewarding learning journey with you.</p>
<p style="margin:0;">Best Regards,<br/>Devatrix Technologies</p>
</div>`;

  return { subject, text, html };
}

export function buildReminderEmail(input: OfferEmailTemplateInput): { subject: string; text: string; html: string } {
  const subject = `Reminder: Complete Your Portal Setup – Devatrix Internship Program`;
  const actionLink = input.setupUrl || input.portalSignInUrl;
  const whatsappUrl = input.whatsappGroupUrl?.trim() || "https://wa.me/923156179410";
  const whatsappText = `Join Interns WhatsApp Group Here:\n${whatsappUrl}`;

  const text = [
    `Dear ${input.fullName},`,
    "",
    `This is a friendly reminder regarding your selection for the REMOTE ${input.track} Internship Program at Devatrix Technologies, starting on ${input.startDate}.`,
    "",
    `Our records show that you have not yet set up your Learner Portal account. Please use the link below to create your password and confirm your placement before orientation begins.`,
    "",
    `Activate Your Learner Portal Account:`,
    actionLink,
    "",
    `Portal Login Email: ${input.studentEmail}`,
    `Candidate Reference ID: ${input.trackingCode}`,
    "",
    whatsappText,
    "",
    "We look forward to having you with us.",
    "",
    "Best Regards,",
    "Devatrix Technologies",
  ].join("\n");

  const safeName = escapeHtml(input.fullName);
  const safeTrack = escapeHtml(input.track);
  const safeStart = escapeHtml(input.startDate);
  const safeEmail = escapeHtml(input.studentEmail);
  const safeCode = escapeHtml(input.trackingCode);
  const safeLink = escapeHtml(actionLink);
  const safeWhatsapp = escapeHtml(whatsappUrl);
  const whatsappHtml = `<p style="margin:0 0 16px 0;">Join Interns WhatsApp Group Here:<br/><a href="${safeWhatsapp}" style="color:#1155cc;">${safeWhatsapp}</a></p>`;

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#222222;width:100%;">
<p style="margin:0 0 16px 0;">Dear ${safeName},</p>
<p style="margin:0 0 16px 0;">This is a friendly reminder regarding your selection for the REMOTE <strong>${safeTrack}</strong> Internship Program at Devatrix Technologies, starting on ${safeStart}.</p>
<p style="margin:0 0 16px 0;">Our records show that you have not yet set up your Learner Portal account. Please use the link below to create your password and confirm your placement before orientation begins.</p>
<p style="margin:0 0 16px 0;">Activate Your Learner Portal Account:<br/><a href="${safeLink}" style="color:#1155cc;word-break:break-all;">${safeLink}</a></p>
<p style="margin:0 0 16px 0;">Portal Login Email: ${safeEmail}<br/>Candidate Reference ID: <strong>${safeCode}</strong></p>
${whatsappHtml}
<p style="margin:0 0 16px 0;">We look forward to having you with us.</p>
<p style="margin:0;">Best Regards,<br/>Devatrix Technologies</p>
</div>`;

  return { subject, text, html };
}
