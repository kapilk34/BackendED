require("dotenv").config();
const express = require("express");
const Stripe = require("stripe");
const sendMail = require("../utils/paymentMail");

const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// @route   POST /api/payment/pay
// @desc    Process Stripe payment
router.post("/pay", async (req, res) => {
  try {
    const { amount, paymentMethodId, email } = req.body;

    if (!amount || !paymentMethodId || !email) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe expects cents
      currency: "usd",
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });

    await sendMail(
      email,
      "Payment Confirmation",
      `✅ Your payment of $${amount} was successful! Transaction ID: ${paymentIntent.id}`
    );

    res.status(200).json({
      success: true,
      message: "Payment successful",
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("❌ Payment error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   POST /api/payment/paypal
// @desc    Process PayPal payment
router.post("/paypal", async (req, res) => {
  try {
    const { amount, email } = req.body;

    if (!amount || !email) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Simulate PayPal payment processing
    const transactionId = `PAYPAL-${Date.now()}`;

    await sendMail(
      email,
      "PayPal Payment Confirmation",
      `✅ Your PayPal payment of $${amount} was successful! Transaction ID: ${transactionId}`
    );

    res.status(200).json({
      success: true,
      message: "PayPal payment successful",
      transactionId,
    });
  } catch (error) {
    console.error("❌ PayPal payment error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
