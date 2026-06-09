import axios from "axios";
import Ticket from "../models/ticketsModel.js";
import Penality from "../models/penalityModel.js";
import TicketPayment from "../models/payTicketModel.js";
import PenalityPayment from "../models/paymentsModel.js";
import User from "../models/userModel.js";
import Report from "../models/reportsModel.js";

const chapaWebhook = async (req, res) => {
  try {
    console.log("========== CHAPA CALLBACK ==========");
    console.log("Method:", req.method);
    console.log("Query:", req.query);

    const tx_ref = req.query.trx_ref;

    if (!tx_ref) {
      return res.status(400).json({
        message: "trx_ref missing",
      });
    }

    // Verify payment with CHAPA
    const verifyResponse = await axios.get(
      `${process.env.CHAPA_VERIFY_URL}/${tx_ref}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
      },
    );

    const payment = verifyResponse.data.data;

    // console.log("Verification Result:", payment);

    if (payment.status !== "success") {
      return res.status(400).json({
        message: "Payment not successful",
      });
    }

    // ===================================
    // PENALITY PAYMENT
    // ===================================
    if (tx_ref.startsWith("penality_")) {
      const penalityId = tx_ref.split("_")[1];

      const penality = await Penality.findById(penalityId);

      if (!penality) {
        return res.status(404).json({
          message: "Penality not found",
        });
      }

      // Avoid duplicate processing
      if (penality.status === "paid") {
        return res.json({
          received: true,
          message: "Already processed",
        });
      }

      // Update Penality
      penality.status = "paid";

      penality.payments.push({
        provider: "chapa",
        providerPaymentId: payment.reference,
        amount: payment.amount,
        currency: payment.currency,
        customer_email: payment.email,
        paidAt: new Date(),
        raw: payment,
      });

      await penality.save();
      await Report.findByIdAndUpdate(penality.reportId, {
        Status: "paid",
      });

      // Save payment history
      await PenalityPayment.create({
        companyId: penality.companyId,
        userId: penality.userId,
        penalityId: penality._id,

        amount: payment.amount,
        currency: payment.currency,

        paymentMethod: "chapa",

        referenceNumber: payment.reference,

        customerEmail: payment.email,

        status: "paid",

        rawResponse: payment,
      });

      console.log("Penality payment saved.");

      return res.json({
        received: true,
      });
    }

    // ===================================
    // TICKET PAYMENT
    // ===================================
    if (tx_ref.startsWith("ticket_")) {
      const ticketId = tx_ref.split("_")[1];

      const ticket = await Ticket.findById(ticketId);

      if (!ticket) {
        return res.status(404).json({
          message: "Ticket not found",
        });
      }

      if (ticket.paymentStatus === "paid") {
        return res.json({
          received: true,
        });
      }

      ticket.payments.push({
        provider: "chapa",
        providerPaymentId: payment.reference,
        amount: payment.amount,
        currency: payment.currency,
        customer_email: payment.email,
        paidAt: new Date(),
        raw: payment,
      });

      ticket.paymentStatus = "paid";
      ticket.paymentMethod = "chapa";
      ticket.paidAt = new Date();

      await ticket.save();

      await TicketPayment.create({
        companyId: ticket.companyId,
        userId: ticket.userId,
        ticketId: ticket._id,

        amount: payment.amount,
        currency: payment.currency,

        paymentMethod: "chapa",

        referenceNumber: payment.reference,
        customerEmail: payment.email,

        status: "paid",

        rawResponse: payment,
      });

      console.log("Ticket payment saved.");

      return res.json({
        received: true,
      });
    }

    return res.status(400).json({
      message: "Unknown payment type",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Webhook failed",
    });
  }
};

export default chapaWebhook;
