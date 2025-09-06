// const express = require("express");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// const sendEmail = require("../utils/sendEmail");
// const authMiddleware = require("../middleware/auth");
// const { welcomeTemplate, loginAlertTemplate } = require("../utils/emailTemplates");
// const dotenv = require("dotenv");
// dotenv.config();
// const router = express.Router();

// // SIGNUP
// router.post("/signup", async (req, res) => {
//   const { name, email, password } = req.body;
//   try {
//     const existing = await User.findOne({ email });
//     if (existing) return res.status(400).json({ message: "User already exists" });

//     const hashed = await bcrypt.hash(password, 10);
//     const user = await User.create({ name, email, password: hashed });

//     // Optional: build URLs (adjust to your frontend)
//     const verifyUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/verify?email=${encodeURIComponent(email)}`;
//     const dashboardUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/dashboard`;

//     // Send HTML welcome email
//     await sendEmail({
//       to: email,
//       subject: `Welcome to ${process.env.APP_NAME || "My App"}!`,
//       html: welcomeTemplate({ name, verifyUrl, dashboardUrl }),
//       text: `Hi ${name}, welcome to ${process.env.APP_NAME || "My App"}! Visit: ${dashboardUrl}`,
//     });

//     res.status(201).json({ message: "User registered successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// // LOGIN
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "Invalid email or password" });

//     const ok = await bcrypt.compare(password, user.password);
//     if (!ok) return res.status(400).json({ message: "Invalid email or password" });

//     const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

// res.status(201).json({ message: "User registered successfully", token });


//     const dashboardUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/dashboard`;

//     // Collect light context for the email (optional)
//     const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").toString();
//     const device = req.headers["user-agent"] || "Unknown device";
//     const time = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

//     // Send HTML login alert
//     await sendEmail({
//       to: email,
//       subject: `Login to ${process.env.APP_NAME || "My App"} successful`,
//       html: loginAlertTemplate({ name: user.name, time, ip, device, dashboardUrl }),
//       text: `Login successful at ${time}. If this wasn't you, reset your password.`,
//     });

//     res.json({ message: "Login successful", token });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// // Protected Route
// router.get("/dashboard", authMiddleware, (req, res) => {
//     res.json({ message: `Welcome, user ${req.user.email}` });
// });

// module.exports = router;





const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    // create JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token, // send token back
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // create JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token, // send token back
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
