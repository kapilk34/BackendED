const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const sendContactMail = async (req, res) => {
  try {
    console.log("Received contact form data:", req.body);
    const { name, email, country, queryType, message } = req.body;

    if (!name || !email || !country || !queryType || !message) {
      console.log("Missing required fields");
      return res.status(400).json({ success: false, msg: "All fields required" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify connection
    await transporter.verify().catch(err => {
      console.error("Email configuration error:", err);
      throw new Error("Email service not properly configured");
    });

    // Mail to Admin
    const adminMail = {
      from: `"EdUnique Minds" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Submission - ${queryType}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Country:</strong> ${country}</p>
        <p><strong>Query Type:</strong> ${queryType}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    // Mail to User
    const userMail = {
      from: `"EdUnique Minds" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "We’ve Received Your Query – EdUnique Minds",
      html: `
        <p>Dear <strong>${name}</strong>,</p>
        <p>Thank you for reaching out to <b>EdUnique Minds</b> regarding <b>${queryType}</b>. 
        We have received your query and our team will get back to you shortly.</p>

        <p><b>About EdUnique Minds:</b></p>
        <p>At EdUnique Minds, we are dedicated to empowering students and professionals 
        through innovative learning solutions. Our services include:</p>
        <ul>
          <li>Personalized mentorship programs</li>
          <li>Career guidance and counseling</li>
          <li>Technical workshops & skill development</li>
          <li>Community-driven learning & networking opportunities</li>
        </ul>

        <p>Meanwhile, you can:</p>
        <ul>
          <li>Connect directly with us for quick assistance on 
            <a href="https://wa.me/919217189006" target="_blank">WhatsApp (Queries)</a>
          </li>
          <li>Join our learning community on 
            <a href="https://whatsapp.com/channel/0029VbBKpMj6mYPEjiSc793O" target="_blank">WhatsApp (Community)</a>
          </li>
        </ul>

        <p>We look forward to guiding you in your learning journey.</p>
        <p>Best Regards,</p>
        <p><strong>EdUnique Minds Team</strong></p>
      `,
    };

    await transporter.sendMail(adminMail);
    await transporter.sendMail(userMail);

    res.json({ success: true, msg: "Mails sent successfully" });
  } catch (err) {
    console.error("Mail Error:", err);
    res.status(500).json({ 
      success: false, 
      msg: "Mail sending failed",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

module.exports = { sendContactMail };
