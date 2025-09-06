const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const handleContactForm = async (req, res) => {
  const { name, email, country, queryType, message } = req.body;

  try {
    // Transporter setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email to Admin
    await transporter.sendMail({
      from: `"EdUnique Minds" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Submission - ${queryType}`,
      html: `
        <h2>New Query from ${name}</h2>
        <p><b>Email:</b> ${email}</p>
        <p><b>Country:</b> ${country}</p>
        <p><b>Query Type:</b> ${queryType}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    });

    // Confirmation Email to User
    await transporter.sendMail({
      from: `"EdUnique Minds" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thanks for contacting EdUnique Minds",
      html: `
        <h3>Hi ${name},</h3>
        <p>Thanks for reaching out to us regarding <b>${queryType}</b>.</p>
        <p>Our support team will get back to you within 24 hours.</p>
        <br/>
        <p>For quick queries, join our <a href="https://wa.me/15551234567">WhatsApp Support</a></p>
        <p>Or become part of our <a href="https://chat.whatsapp.com/XXXXXXXXX">Community Channel</a></p>
        <br/>
        <p>Best Regards,</p>
        <p>EdUnique Minds Team</p>
      `,
    });

    res.status(200).json({ success: true, message: "Form submitted & email sent" });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};

module.exports = { handleContactForm };
