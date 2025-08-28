const express = require("express");
const { sendPaymentMail } = require("../utils/paymentMail");
const router = express.Router();

// Send confirmation mail (trigger after success page)
router.post("/send-mail", async (req, res) => {
  try {
    const { email, amount, purpose } = req.body;
    await sendPaymentMail(email, amount, purpose);
    res.send({ success: true, message: "Mail sent successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
