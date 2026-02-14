const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Transaction = require("../models/Transaction");

/*
INI ADALAH PEMBAYARAN DENGAN DATA USERS ASLI
DENGAN DIDAFTARKAN DI STRIPE LANGSUNG
*/
// // GET payment methods
// router.get("/methods", async (req, res) => {
//   try {
//     const { customerId } = req.query;

//     if (!customerId)
//       return res.status(400).json({ message: "customerId required" });

//     const methods = await stripe.paymentMethods.list({
//       customer: customerId,
//       type: "card"
//     });

//     res.json(methods);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to get payment methods" });
//   }
// });

// // Create Cust
// router.post("/create-customer", async (req, res) => {
//   try {
//     const { email } = req.body;

//     const customer = await stripe.customers.create({ email });

//     res.json(customer);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Create payment intent
// router.post("/create-payment-intent", async (req, res) => {
//   try {
//     const { amount, email, customerId } = req.body;

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency: "usd",
//       customer: customerId,
//       receipt_email: email,
//       setup_future_usage: "off_session",
//       payment_method_types: ["card"]
//     });

//     res.send({
//       clientSecret: paymentIntent.client_secret
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Webhook callback
// router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
//   const sig = req.headers["stripe-signature"];
//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       req.body,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//   } catch (err) {
//     return res.status(400).send(`Webhook error: ${err.message}`);
//   }

//   if (event.type === "payment_intent.succeeded") {
//     const paymentIntent = event.data.object;

//     await Transaction.create({
//       paymentIntentId: paymentIntent.id,
//       amount: paymentIntent.amount,
//       currency: paymentIntent.currency,
//       status: paymentIntent.status,
//       email: paymentIntent.receipt_email
//     });
//   }

//   res.json({ received: true });
// });

/*
INI ADALAH PEMBAYARAN DENGAN METODE SESSION,
MENGIRIMKAN URL UNTUK HALAMAN BAYAR
*/
// POST CHECKOUT
router.post("/checkout", async (req, res) => {
  try {
    const { email, amount } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      customer_email: email,

      line_items: [{
        price_data: {
          currency: "idr",
          product_data: { name: "Test Product" },
          unit_amount: amount
        },
        quantity: 1
      }],

      success_url: "http://localhost:5000/api/payment/success",
      cancel_url: "http://localhost:5000/api/payment/cancel"
    });

    res.json({ url: session.url });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// WEBHOOK
router.post("/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {

    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send(err.message);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      await Transaction.create({
        sessionId: session.id,
        email: session.customer_email,
        amount: session.amount_total,
        currency: session.currency,
        status: "paid"
      });
    }

    res.json({ received: true });
  });


// GET RESPONSE
router.get("/success", (req, res) => res.json("success"));
router.get("/error", (req, res) => res.json("error"));

module.exports = router;
