const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
});

/**
 * Send email with both HTML & text
 * @param {Object} opts
 * @param {string} opts.to
 * @param {string} opts.subject
 * @param {string} [opts.html]
 * @param {string} [opts.text]
 */
async function sendEmail({ to, subject, html, text }) {
  const mail = {
    from: `"${process.env.APP_NAME || "My App"}" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    // Provide text fallback in case HTML is stripped
    text: text || "If you cannot view this email, please enable HTML emails.",
    html,
  };

  try {
    const info = await transporter.sendMail(mail);
    console.log(`📩 Email sent: ${info.messageId}`);
  } catch (err) {
    console.error("❌ Email Error:", err);
    throw err;
  }
}

module.exports = sendEmail;
