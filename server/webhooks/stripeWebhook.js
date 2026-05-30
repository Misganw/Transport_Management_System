import Stripe from "stripe";
import Ticket from "../models/ticketsModel.js";
import Penality from "../models/penalityModel.js";

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
    const paymentType = session.metadata.paymentType;
    // =========================
    // TICKET PAYMENT
    // =========================
    if (paymentType === "ticket") {
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
    // =========================
    // PENALITY PAYMENT
    // =========================
    if (paymentType === "penality") {
      const penalityId = session.metadata.penalityId;

      const penality = await Penality.findById(penalityId);

      if (!penality) {
        return res.status(404).json({
          message: "Penality not found",
        });
      }

      // optional payment history
      penality.payments.push({
        provider: "stripe",
        providerPaymentId: session.id,
        paymentIntent: session.payment_intent,
        amount: session.amount_total / 100,
        currency: session.currency,
        customer_name: session.customer_details?.name,
        customer_email: session.customer_details?.email,
        paidAt: new Date(),
        raw: session,
      });
      if (penality && penality.status !== "paid") {
        penality.status = "paid";
        penality.paymentMethod = "stripe";
        penality.paidAt = new Date();

        await penality.save();
      }
    }
  }

  res.json({ received: true });
};
export default stripeWebhook;
