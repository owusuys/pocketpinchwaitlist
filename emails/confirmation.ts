/**
 * Confirmation email content for new waitlist signups.
 * Plain template strings (HTML + plaintext) — no react-email dependency, keeps
 * the serverless bundle light. On-brand dark card with the go-green accent.
 */

const GREEN = "#16A34A";
const BG = "#0E0F12";
const RAISED = "#17181D";
const TEXT = "#F5F5F7";
const MUTED = "#9A9BA3";

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string
  );
}

export const confirmationSubject = "You're on the PocketPinch waitlist 🎉";

export function confirmationHtml(firstName: string): string {
  const name = escapeHtml(firstName.trim() || "there");
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:${BG};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:${RAISED};border-radius:20px;border:1px solid #2A2B33;padding:32px;">
            <tr>
              <td style="font-size:22px;font-weight:700;color:${TEXT};padding-bottom:8px;">
                You&rsquo;re on the list, ${name}. 🎉
              </td>
            </tr>
            <tr>
              <td style="font-size:15px;line-height:1.6;color:${MUTED};padding-bottom:16px;">
                Thanks for joining the <strong style="color:${TEXT};">PocketPinch</strong> waitlist.
                We&rsquo;re building the fastest way to answer one question:
                <em style="color:${TEXT};">can I afford this, right now?</em>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 0;">
                <span style="display:inline-block;background:${GREEN};color:#ffffff;font-size:14px;font-weight:600;padding:10px 18px;border-radius:10px;">
                  Know before you buy.
                </span>
              </td>
            </tr>
            <tr>
              <td style="font-size:15px;line-height:1.6;color:${MUTED};padding-top:8px;">
                We&rsquo;ll email you once &mdash; the moment it&rsquo;s ready. No spam, ever.
              </td>
            </tr>
            <tr>
              <td style="font-size:13px;line-height:1.6;color:#6B6C75;padding-top:24px;border-top:1px solid #2A2B33;margin-top:24px;">
                Got a question or an idea? Just reply to this email &mdash; we read every one.
                <br /><br />
                &mdash; The PocketPinch team · Entafo Studios
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function confirmationText(firstName: string): string {
  const name = firstName.trim() || "there";
  return [
    `You're on the list, ${name}. 🎉`,
    "",
    "Thanks for joining the PocketPinch waitlist. We're building the fastest way to",
    "answer one question: can I afford this, right now?",
    "",
    "Know before you buy.",
    "",
    "We'll email you once — the moment it's ready. No spam, ever.",
    "",
    "Got a question or an idea? Just reply to this email — we read every one.",
    "",
    "— The PocketPinch team · Entafo Studios",
  ].join("\n");
}
