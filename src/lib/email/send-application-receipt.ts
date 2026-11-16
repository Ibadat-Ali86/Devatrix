type ApplicationReceipt = {
  idempotencyKey: string;
  name: string;
  email: string;
  track: string;
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

export async function sendApplicationReceipt(input: ApplicationReceipt): Promise<boolean> {
  const isLocalInstantTest =
    process.env.NODE_ENV !== "production" &&
    process.env.APPLICATION_EMAIL_MODE === "instant_test";
  const permittedRecipient = process.env.APPLICATION_EMAIL_TEST_RECIPIENT?.trim().toLowerCase();

  if (!isLocalInstantTest || !permittedRecipient || input.email !== permittedRecipient) {
    return false;
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    console.error("Application receipt email is not configured");
    return false;
  }

  const safeName = escapeHtml(input.name);
  const safeTrack = escapeHtml(input.track);
  let origin = "http://localhost:3000";
  try {
    const configuredOrigin = new URL(process.env.NEXT_PUBLIC_SITE_URL || origin);
    if (configuredOrigin.protocol === "https:" || configuredOrigin.hostname === "localhost") {
      origin = configuredOrigin.origin;
    }
  } catch {
    // Fall back to the local portal URL when the site origin is invalid.
  }
  const portalUrl = `${origin}/portal`;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `application-received/${input.idempotencyKey}`,
    },
    body: JSON.stringify({
      from,
      to: [input.email],
      subject: "We received your Devatrix internship application",
      text: [
        `Hello ${input.name},`,
        "",
        `We have received your application for ${input.track}. It is now under review by the Devatrix team.`,
        "",
        "This is an application receipt only. Portal access details will be sent separately if your application progresses.",
        "",
        `Portal: ${portalUrl}`,
        "",
        "Devatrix Technologies",
      ].join("\n"),
      html: `<div style="font-family:Arial,sans-serif;color:#10243e;line-height:1.6;max-width:600px;margin:auto"><p>Hello ${safeName},</p><p>We have received your application for <strong>${safeTrack}</strong>. It is now under review by the Devatrix team.</p><p>This is an application receipt only. Portal access details will be sent separately if your application progresses.</p><p><a href="${portalUrl}" style="color:#b96100">Visit the intern portal</a></p><p>Regards,<br/>Devatrix Technologies</p></div>`,
    }),
    signal: AbortSignal.timeout(8_000),
  });

  if (!response.ok) {
    console.error("Application receipt email provider returned an error", { status: response.status });
    return false;
  }
  return true;
}
