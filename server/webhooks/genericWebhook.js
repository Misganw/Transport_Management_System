import Stripe from "stripe";
import Ticket from "../models/ticketsModel.js";
import axios from "axios"; // can be used for PayPal/Flutterwave verification

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const genericWebhook = async (req, res) => {
  try {
    const providerHeader = req.headers["x-provider"]; // 'stripe', 'paypal', 'flutterwave'
    if (!providerHeader) return res.status(400).send("Provider header missing");

    const provider = providerHeader.toLowerCase();

    switch (provider) {
      case "stripe":
        const sig = req.headers["stripe-signature"];
        let event;
        try {
          event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET,
          );
        } catch (err) {
          console.error("Stripe webhook signature failed", err.message);
          return res.status(400).send(`Stripe Webhook Error`);
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

            const ticket =
              await Ticket.findById(ticketId).populate("programId");
            if (!ticket)
              return res.status(404).json({ message: "Ticket not found" });
            // Push Stripe payment into payments array
            ticket.payments.push({
              provider: "stripe",
              providerPaymentId: session.id,
              paymentIntent: session.payment_intent,
              amount: session.amount_total / 100, // convert cents to dollars
              currency: session.currency,
              customer_name:
                session.customer_details?.name || ticket.passengerName,
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
            await TicketPayment.create({
              companyId: ticket.companyId,
              userId: ticket.userId,
              ticketId: ticket._id,
              amount: session.amount_total / 100,
              currency: session.currency,

              paymentDate: session.paidAt,

              paymentMethod: "stripe",

              referenceNumber: session.payment_intent,

              stripeSessionId: session.id,

              customerName:
                session.customer_details?.name || ticket.passengerName,

              customerEmail: session.customer_details?.email || ticket.email,

              customerPhone: session.customer_details?.phone || "",

              status: "paid",

              rawResponse: session,
            });
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
            await PenalityPayment.create({
              companyId: penality.companyId,
              userId: penality.userId,
              penalityId: penality._id,
              amount: session.amount_total / 100,
              currency: session.currency,

              paymentDate: session.paidAt,

              paymentMethod: "stripe",

              referenceNumber: session.payment_intent,

              stripeSessionId: session.id,

              customerName: session.customer_details?.name,

              customerEmail: session.customer_details?.email,

              customerPhone: session.customer_details?.phone || "",

              status: "paid",

              rawResponse: session,
            });
          }
        }
        break;

      case "paypal":
        // PayPal Webhook: validate event via PayPal API
        const paypalEvent = req.body;
        const ticketIdPayPal = paypalEvent.resource.custom; // e.g. pass ticketId in PayPal 'custom' field
        const ticketPayPal = await Ticket.findById(ticketIdPayPal);
        if (!ticketPayPal) return res.status(404).send("Ticket not found");

        ticketPayPal.paymentStatus = "paid";
        ticketPayPal.paidAt = new Date();

        ticketPayPal.payments.push({
          provider: "paypal",
          providerPaymentId: paypalEvent.resource.id,
          amount: parseFloat(paypalEvent.resource.amount.value),
          currency: paypalEvent.resource.amount.currency_code,
          customer_name:
            paypalEvent.resource.payer?.name?.given_name ||
            ticketPayPal.passengerName,
          customer_email:
            paypalEvent.resource.payer?.email_address || ticketPayPal.email,
          paidAt: new Date(paypalEvent.resource.create_time),
          raw: paypalEvent,
        });

        await ticketPayPal.save();
        break;

      case "flutterwave":
        const flutterEvent = req.body;
        const ticketIdFlutter = flutterEvent.tx_ref; // pass ticketId in tx_ref
        const ticketFlutter = await Ticket.findById(ticketIdFlutter);
        if (!ticketFlutter) return res.status(404).send("Ticket not found");

        if (flutterEvent.status === "successful") {
          ticketFlutter.paymentStatus = "paid";
          ticketFlutter.paidAt = new Date();

          ticketFlutter.payments.push({
            provider: "flutterwave",
            providerPaymentId: flutterEvent.id,
            amount: flutterEvent.amount,
            currency: flutterEvent.currency,
            customer_name:
              flutterEvent.customer?.name || ticketFlutter.passengerName,
            customer_email: flutterEvent.customer?.email || ticketFlutter.email,
            paidAt: new Date(),
            raw: flutterEvent,
          });

          await ticketFlutter.save();
        }
        break;

      default:
        return res.status(400).send("Unsupported provider");
    }

    res.json({ received: true });
  } catch (err) {
    console.error(err);
    res.status(500).send("Webhook handling failed");
  }
};

export default genericWebhook;
