const nodemailer = require("nodemailer");

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

    const adminMail = {
      from: `"EdUnique Minds" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `📩 New Contact Form - ${queryType}`,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Country:</strong> ${country}</p>
             <p><strong>Query:</strong> ${message}</p>`,
    };

    const userMail = {
      from: `"EdUnique Minds" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "✅ We got your query",
      html: `<p>Hi ${name},</p>
             <p>Thanks for reaching out regarding <b>${queryType}</b>.</p>
             <p>Our team will contact you shortly.</p>
             <p>– EdUnique Minds Team</p>`,
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
