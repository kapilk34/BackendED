const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const sendMail = async ({ name, email, title, discription, type, level, file, message }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // or "outlook" / custom SMTP
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    let mailOptions = {
      from: `"${name}" <${process.env.SMTP_USER}>`,
      to: process.env.RECEIVER_EMAIL, // your receiving email
      subject: title || "New Contact Form Submission",
      text: `
📩 New Contact Form Submission

Name: ${name}
Email: ${email}
Type: ${type || "N/A"}
Level: ${level || "N/A"}
Message: ${discription || message || "No description"}
      `,
    };

    if (file) {
      mailOptions.attachments = [
        {
          filename: file.originalname,
          content: file.buffer,
        },
      ];
    }

    await transporter.sendMail(mailOptions);
    console.log("✅ Mail sent successfully");
  } catch (error) {
    // fallback: log instead of crashing
    console.error("❌ Mail sending failed, fallback to log:", error.message);
    console.log(`
      ---- CONTACT FORM FALLBACK ----
      Name: ${name}
      Email: ${email}
      Message: ${discription || message || "No description"}
      --------------------------------
    `);
    throw error;
  }
};

module.exports = sendMail;
