const COMPANY = process.env.APP_NAME || "Edunique Mind Private Limited";
const SUPPORT_URL = process.env.SUPPORT_URL || "#";
const dotenv = require("dotenv");
dotenv.config();
const LOGO_URL =
  process.env.LOGO_URL ||
  "https://gvu57hqxi3.ufs.sh/f/FOd38ztMu1UwmasSWIcW8p1VwSr6YDJTLjBZXz3x49d205ya"; 

// Base wrapper for consistent branding
function baseLayout({ preheader = "Edunique Mind", title = "", bodyHtml = "" }) {
  // Preheader appears in inbox preview
  const safePreheader =
    preheader.replace(/</g, "&lt;").replace(/>/g, "&gt;") || "Edunique Minds";

  return `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${COMPANY}</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <style>
    /* Dark mode friendly defaults */
    @media (prefers-color-scheme: dark) {
      .bg { background: #111111 !important; }
      .card { background: #1b1b1b !important; }
      .text { color: #eaeaea !important; }
      .muted { color: #b3b3b3 !important; }
      .btn { background: #3b82f6 !important; color: #ffffff !important; }
    }
    a { text-decoration: none; }
  </style>
</head>
<body style="margin:0;padding:0;background:#f4f5f7;" class="bg">
  <span style="display:none;opacity:0;visibility:hidden;height:0;width:0;color:transparent;">
    ${safePreheader}
  </span>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f5f7;" class="bg">
    <tr>
      <td align="center" style="padding:24px;">
        <!-- Card -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.06);" class="card">
          <!-- Header -->
          <tr>
            <td align="center" style="padding:24px 24px 8px;">
              <img src="${LOGO_URL}" width="100" height="80" alt="${COMPANY}" style="display:block;border:0;line-height:100%;outline:none;text-decoration:none;">
            </td>
          </tr>

          ${title ? `
          <tr>
            <td align="center" style="padding:0 24px 8px;">
              <h1 style="margin:0;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:22px;line-height:1.3;color:#111827;" class="text">
                ${title}
              </h1>
            </td>
          </tr>` : ""}

          <!-- Body -->
          <tr>
            <td style="padding:8px 24px 24px;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#374151;" class="text">
              ${bodyHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:16px 24px 24px;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:#6b7280;" class="muted">
              You’re receiving this email because you have an account on <strong>${COMPANY}</strong>.
              <br>
              Need help? <a href="${SUPPORT_URL}" style="color:#3b82f6;">Contact support</a>.
              <br><br>
              © ${new Date().getFullYear()} ${COMPANY}. All rights reserved.
            </td>
          </tr>
        </table>
        <!-- /Card -->
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

// Reusable button block
function button({ url, label }) {
  return `
<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:16px 0;">
  <tr>
    <td align="center" bgcolor="#2563eb" style="border-radius:10px;">
      <a href="${url}" target="_blank"
         style="display:inline-block;padding:12px 18px;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:14px;color:#ffffff;background:#2563eb;border-radius:10px;">
        ${label}
      </a>
    </td>
  </tr>
</table>`;
}

/** Welcome template (after signup) */
function welcomeTemplate({ name = "there", verifyUrl = "", dashboardUrl = "" }) {
  const body = `
<p>Hi ${name},</p>
<p>Welcome to <strong>${COMPANY}</strong>! We’re excited to have you on board.</p>

${verifyUrl ? `
<p>To complete your setup, please verify your email address:</p>
${button({ url: verifyUrl, label: "Verify Email" })}
<p style="font-size:12px;color:#6b7280;" class="muted">
  If the button doesn’t work, copy and paste this URL into your browser:<br>
  <span style="word-break:break-all;">${verifyUrl}</span>
</p>` : ""}

${dashboardUrl ? `
<p>You can get started right away here:</p>
${button({ url: dashboardUrl, label: "Go to Dashboard" })}
` : ""}

<p>If you didn’t sign up, you can safely ignore this email.</p>
<p>Cheers,<br>${COMPANY} Team</p>
`;

  return baseLayout({
    preheader: `Welcome to ${COMPANY}!`,
    title: "Welcome aboard 🎉",
    bodyHtml: body,
  });
}

/** Login alert template (after login) */
function loginAlertTemplate({
  name = "there",
  time = new Date().toLocaleString(),
  ip = "Unknown IP",
  device = "Unknown device",
  dashboardUrl = "",
  resetUrl = "",
}) {
  const body = `
<p>Hi ${name},</p>
<p>We noticed a successful login to your <strong>${COMPANY}</strong> account.</p>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:12px 0;background:#f9fafb;border-radius:12px;" class="card">
  <tr>
    <td style="padding:12px 16px;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:14px;color:#374151;" class="text">
      <strong>Time:</strong> ${time}<br>
      <strong>IP:</strong> ${ip}<br>
      <strong>Device:</strong> ${device}
    </td>
  </tr>
</table>

${dashboardUrl ? button({ url: dashboardUrl, label: "Open Dashboard" }) : ""}

<p>If this wasn’t you, we recommend you reset your password immediately.</p>
${resetUrl ? button({ url: resetUrl, label: "Reset Password" }) : ""}

<p>Stay safe,<br>${COMPANY} Security</p>
`;

  return baseLayout({
    preheader: "New login to your account",
    title: "Login successful ",
    bodyHtml: body,
  });
}

module.exports = {
  welcomeTemplate,
  loginAlertTemplate,
};
