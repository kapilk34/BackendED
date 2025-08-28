require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const sendMail = require("./utils/serviceMail");
const multer = require("multer")
const Stripe = require("stripe");


const app = express();

app.use(cors({ origin: "http://localhost:5173" })); // allow only frontend URL
// or app.use(cors()); // allow all origins (for testing)

app.use(express.json());

// Multer setup for file uploads (in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


connectDB();
app.use("/api/auth", authRoutes);

const paymentRoutes = require("./routes/paymentRoutes");
const contactRoutes = require("./routes/contectRoutes");

// Route to handle form submission
app.post("/send-mail", upload.single("documents"), async (req, res) => {
  try {
    const { name, email, title, discription, type, level } = req.body;
    const file = req.file;

    await sendMail({ name, email, title, discription, type, level, file });

    res.status(200).json({ message: "Form submitted successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email" });
  }
});


// Routes
app.use("/api/payment", paymentRoutes);
app.use("/api/contact", contactRoutes);

// 404 handler (always return JSON)
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Error handler (always return JSON)
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err);
  res.status(500).json({ success: false, message: "Server error", error: err.message });
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
