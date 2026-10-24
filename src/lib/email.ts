export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromName = process.env.EMAIL_FROM_NAME || 'SecureTools Review Desk';
  const fromAddress = process.env.EMAIL_FROM_ADDRESS || 'no-reply@securetools.live';

  if (!apiKey) {
    console.warn('RESEND_API_KEY is not set. Email not sent.');
    return { success: false, error: 'RESEND_API_KEY missing' };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${fromName} <${fromAddress}>`,
        to: [to],
        subject,
        html,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.warn('Resend error response:', data);
      return { success: false, error: data };
    }

    return { success: true, id: data.id };
  } catch (err: any) {
    console.error('Resend network error:', err);
    return { success: false, error: err.message };
  }
}

// ── Email Templates for Listing Moderation ──────────────────────────────────
export function getStatusEmailHtml({
  toolName,
  status,
  reason,
  referenceId,
}: {
  toolName: string;
  status: 'published' | 'rejected' | 'under_review' | 'pending_review';
  reason?: string;
  referenceId?: string;
}) {
  const isApproved = status === 'published';
  const isRejected = status === 'rejected';

  const heading = isApproved
    ? `🎉 Your listing "${toolName}" is Approved & Live!`
    : isRejected
    ? `Update on your submission: "${toolName}"`
    : `Editorial review started: "${toolName}"`;

  const bodyText = isApproved
    ? `We are pleased to inform you that <strong>${toolName}</strong> has successfully completed our technical verification and editorial review. It is now published live on the SecureTools.live global directory.`
    : isRejected
    ? `Thank you for submitting <strong>${toolName}</strong>. Following our editorial evaluation, we were unable to approve this listing for the directory.${
        reason ? ` Reason: ${reason}` : ' SecureTools exclusively accepts functional software, zero-knowledge tools, and security extensions within our 24 covered file security categories.'
      }`
    : `Our editorial team has started the technical verification of <strong>${toolName}</strong>. We will review your security specifications, encryption standards, and website credentials shortly.`;

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; color: #18181b; background-color: #ffffff; border: 1px solid #e4e4e7; rounded: 12px;">
      <div style="margin-bottom: 20px;">
        <span style="font-weight: 700; font-size: 16px; letter-spacing: -0.5px; color: #09090b;">SecureTools<span style="color: #02ccc1;">.live</span></span>
      </div>
      <h1 style="font-size: 20px; font-weight: 700; margin-bottom: 12px; color: #09090b; letter-spacing: -0.3px;">${heading}</h1>
      <p style="font-size: 14px; line-height: 1.6; color: #52525b; margin-bottom: 20px;">
        ${bodyText}
      </p>
      ${
        referenceId
          ? `<div style="background-color: #f4f4f5; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px; font-size: 13px;">
              <span style="color: #71717a;">Reference ID:</span> <strong style="font-family: monospace; color: #09090b;">${referenceId}</strong>
            </div>`
          : ''
      }
      ${
        isApproved
          ? `<a href="https://securetools.live/tools" style="display: inline-block; background-color: #09090b; color: #ffffff; padding: 10px 20px; border-radius: 8px; font-size: 13px; font-weight: 600; text-decoration: none;">View in Directory →</a>`
          : `<a href="https://securetools.live/dashboard" style="display: inline-block; background-color: #09090b; color: #ffffff; padding: 10px 20px; border-radius: 8px; font-size: 13px; font-weight: 600; text-decoration: none;">Go to Dashboard →</a>`
      }
      <hr style="border: 0; border-top: 1px solid #e4e4e7; margin: 28px 0 16px 0;" />
      <p style="font-size: 11px; color: #a1a1aa; line-height: 1.5;">
        This automated notification was dispatched by the SecureTools.live Editorial Operations Desk. Replies to this email are monitored.
      </p>
    </div>
  `;
}
