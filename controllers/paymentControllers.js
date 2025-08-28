const Stripe = require("stripe");
const sendEmail = require("../utils/sendEmail");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const processPayment = async (req, res) => {
  try {
    const { amount, email, cardNumber, expMonth, expYear, cvc } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // cents
      currency: "usd",
      payment_method_data: {
        type: "card",
        card: {
          number: cardNumber,
          exp_month: expMonth,
          exp_year: expYear,
          cvc,
        },
      },
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never", // ✅ Prevents redirect errors
      },
    });

    // ✅ Send confirmation email
    await sendEmail({
      to: email,
      subject: "Payment Successful",
      text: `Your payment of $${amount} was successful. Thank you for your order!`,
    });

    res.status(200).json({
      success: true,
      message: "Payment successful",
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Payment error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Correct export (fixes your error)
module.exports = { processPayment };
