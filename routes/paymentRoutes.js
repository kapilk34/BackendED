const express = require("express");
const Stripe = require("stripe");
const sendMail = require("../utils/paymentMail");

const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// @route   POST /api/payment/pay
// @desc    Process payment
router.post("/pay", async (req, res) => {
  try {
    const { amount, cardNumber, expMonth, expYear, cvc, cardName, email } = req.body;

    if (!amount || !cardNumber || !expMonth || !expYear || !cvc || !cardName || !email) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Create payment method
    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: {
        number: cardNumber,
        exp_month: expMonth,
        exp_year: expYear,
        cvc: cvc,
      },
      billing_details: {
        name: cardName,
        email: email,
      },
    });

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe expects cents
      currency: "usd",
      payment_method: paymentMethod.id,
      confirm: true,
    });

    // Send confirmation email
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
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
