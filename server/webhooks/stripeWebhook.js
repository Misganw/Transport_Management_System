import Stripe from "stripe";
import Ticket from "../models/ticketsModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("Webhook signature failed", err.message);
    return res.status(400).send(`Webhook Error`);
  }

  // ✅ Payment successful
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const ticketId = session.metadata.ticketId;

    const ticket = await Ticket.findById(ticketId).populate("programId");
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    // Push Stripe payment into payments array
    ticket.payments.push({
      provider: "stripe",
      providerPaymentId: session.id,
      paymentIntent: session.payment_intent,
      amount: session.amount_total / 100, // convert cents to dollars
      currency: session.currency,
      customer_name: session.customer_details?.name || ticket.passengerName,
      customer_email: session.customer_details?.email || ticket.email,
      paidAt: new Date(),
      raw: session,
    });
    if (ticket && ticket.paymentStatus !== "paid") {
      ticket.paymentStatus = "paid";
      ticket.paymentMethod = "stripe";
      ticket.paidAt = new Date();
      await ticket.save();
    }
  }

  res.json({ received: true });
};
export default stripeWebhook;
