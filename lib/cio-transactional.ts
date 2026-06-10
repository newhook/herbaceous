import "server-only";

// Backend-only Customer.io App API client for transactional sends.
//
// The App API key is workspace-scoped and must never reach the browser — this
// module is server-only and the key is read from a non-public env var. Sends go
// through Customer.io's App API (https://api.customer.io), not the CDP pipeline.
const APP_API_KEY = process.env.CIO_APP_API_KEY;
const BASE_URL = process.env.CIO_APP_API_BASE_URL ?? "https://api.customer.io";

// Verified sandbox sender on the starter domain. Swap for a custom-domain
// address at go-live.
const FROM = "Herbaceous <matthew.newhook+h1@pale-vine-7878.us.customerio.build>";

// Stable, non-numeric transactional message id. `auto_create` provisions the
// "welcome_email" transactional message on first send and reuses it after.
const WELCOME_MESSAGE_ID = "welcome_email";

function welcomeBody(): string {
  // Liquid placeholders are filled from `message_data` on each send.
  return `<!doctype html>
<html>
  <body style="font-family: ui-sans-serif, system-ui, sans-serif; color: #1a1a1a; line-height: 1.5;">
    <h1 style="margin: 0 0 12px;">Welcome to Herbaceous, {{ first_name }} 🌿</h1>
    <p>Thanks for signing up! Tell us what you love to eat and we'll suggest
       herbs worth planting in your garden.</p>
    <p style="margin-top: 24px;">
      <a href="https://demo-rho-eight-83.vercel.app/dashboard"
         style="display: inline-block; background: #15803d; color: #fff;
                padding: 10px 18px; border-radius: 9999px; text-decoration: none;">
        Get your recommendations
      </a>
    </p>
    <p style="color: #6b7280; font-size: 13px; margin-top: 28px;">
      Happy gardening,<br />The Herbaceous team
    </p>
  </body>
</html>`;
}

// Send the signup welcome email. Best-effort: callers should not let a failure
// here break account creation. Returns true on a successful API accept.
export async function sendWelcomeEmail(params: {
  email: string;
  name: string;
}): Promise<boolean> {
  if (!APP_API_KEY) {
    console.warn("welcome-email-skipped: CIO_APP_API_KEY not configured");
    return false;
  }

  const firstName = params.name.trim().split(/\s+/)[0] || "there";

  const res = await fetch(`${BASE_URL}/v1/send/email`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${APP_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      transactional_message_id: WELCOME_MESSAGE_ID,
      auto_create: true,
      to: params.email,
      identifiers: { email: params.email },
      from: FROM,
      subject: "Welcome to Herbaceous 🌿",
      body: welcomeBody(),
      message_data: { first_name: firstName },
    }),
  });

  if (!res.ok) {
    // Surface the reason for debugging but never log the API key.
    const detail = await res.text().catch(() => "");
    console.error(`welcome-email-failed: ${res.status} ${detail}`);
    return false;
  }

  console.log("welcome-email-sent");
  return true;
}
