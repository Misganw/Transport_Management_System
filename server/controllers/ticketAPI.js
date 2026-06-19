import express from "express";
import mongoose from "mongoose";
import Ticket from "../models/ticketsModel.js";
import Program from "../models/programsModel.js";
import CancelledTicket from "../models/cancelledTicketModel.js";
import Company from "../models/companyModel.js";
import Stripe from "stripe";
import { formatDateOnly } from "../util/dayUtility.js";
import axios from "axios";

// Helper to generate reservation code
function generateReservationCode() {
  // return Math.random().toString(36).substring(2, 10).toUpperCase();
  return Math.random()
    .toString(36)
    .replace(/[^a-z]/g, "")
    .substring(0, 6)
    .toUpperCase();
}

// GET /Tickets
const list = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    const search = req.query.search || "";

    // Get all Programs that belong to the current user in this company
    const company = await Company.find({
      _id: user.companyID,
    }).select("_id");
    const companyIds = company.map((c) => c._id);

    // $regex used to make word pattern match, I used to avoid case sensesitivity.
    const filter = search
      ? {
          $or: [
            { passengerName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { reservationCode: { $regex: search, $options: "i" } },
            { paymentStatus: { $regex: search, $options: "i" } },
            { ...(isNaN(search) ? [] : [{ seatNumber: parseInt(search) }]) },
          ],
        }
      : {};

    const qry = {
      companyId: { $in: companyIds },
      ...filter,
    };
    if (user.roles === "passenger") {
      qry.userId = user.id;
    }
    const Tickets = await Ticket.find(qry)
      .populate({ path: "companyId", select: "companyName" })
      .populate({ path: "userId", select: "name" })
      .populate({
        path: "programId",
        select: "tarrif queue",
        populate: [
          { path: "carId", select: "type level" },
          { path: "routId", select: "departure arrival" },
        ],
      });

    res.json(Tickets);
  } catch (error) {
    res.status(500).json({ message: "Error getting Tickets List" });
  }
};

const getOne = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Error getting ticket." });
  }
};

// POST /Tickets
const create = async (req, res) => {
  const { passengerId, programId, passengerName, email, phone } = req.body;
  const userId = req.user.id;
  const companyId = req.user.companyID;

  // const session = await mongoose.startSession();
  try {
    // session.startTransaction();

    // Load program + car
    const program = await Program.findById(programId).populate(
      "carId",
      "NoofSeats",
    );

    if (!program) {
      throw new Error("Program not found");
    }

    const totalSeats = program.carId?.NoofSeats || 0;
    const paidSeats = program.paidSeatCount || 0;

    if (paidSeats >= totalSeats) {
      throw new Error("All seats are already reserved");
    }

    // Check if passenger already has a ticket for the same day
    // Compare dates only
    const todayStr = formatDateOnly(new Date());
    // console.log("utility Date", todayStr);
    const existingTicket = await Ticket.findOne({
      passengerId,
      $expr: {
        $eq: [
          { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          todayStr,
        ],
      },
    });

    if (existingTicket) {
      throw new Error("Passenger already has a ticket for this day");
    }

    // Create ticket
    const ticket = await Ticket.create([
      {
        companyId,
        userId,
        passengerId,
        programId,
        purchaseDate: program.date,
        passengerName,
        email,
        phone,
        reservationCode: generateReservationCode(),
        paymentStatus: "reserved",
        seatNumber: paidSeats + 1,
      },
    ]);

    //Update program seat counter
    program.paidSeatCount = paidSeats + 1;

    if (program.paidSeatCount >= totalSeats) {
      program.status = "full"; // or "out"
    }

    await program.save();

    // await session.commitTransaction();
    // session.endSession();

    res.status(201).json(ticket[0]);
  } catch (error) {
    // await session.abortTransaction();
    // session.endSession();

    res.status(400).json({
      message: error.message || "Ticket reservation failed",
    });
  }
};

// PUT /Tickets/:id
const update = async (req, res) => {
  try {
    const updated = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating Ticket" });
  }
};

// DELETE /Tickets/:id
const remove = async (req, res) => {
  try {
    await Ticket.findByIdAndDelete(req.params.id);
    res.json({ message: "Ticket deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Ticket" });
  }
};

// List all tickets for a specific program
export const listTicketByProgram = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    const { programId } = req.params;

    if (!programId) {
      return res.status(400).json({ error: "Program ID is required" });
    }

    // Get all Programs that belong to the current user in this company
    const company = await Company.find({
      _id: user.companyID,
    }).select("_id");
    const companyIds = company.map((c) => c._id);
    // Base query
    let qry = {
      companyId: { $in: companyIds },
    };

    // Restrict if user is passenger
    if (user.roles === "passenger") {
      qry.userId = user.id;
      // assuming Passenger.userId references the logged-in user
    }

    const tickets = await Ticket.find({ programId, ...qry })
      .sort({ seatNumber: 1 })
      .populate({ path: "companyId", select: "companyName" })
      .populate({ path: "userId", select: "name" }) // the person who printed / booked
      .populate({
        path: "programId",
        populate: [
          { path: "carId", select: "type level NoofSeats" },
          { path: "routId", select: "departure arrival" },
        ],
      });
    // res.json(tickets);
    // console.log("Fetched tickets for program:", programId, tickets.length);
    res.json(Array.isArray(tickets) ? tickets : []); // ensure it's always an array
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
};

/** ..........Cancel ticket.........*/
export const cancelTicket = async (req, res) => {
  const user = req.user; // from auth middleware
  let canceler = "";

  try {
    // await Ticket.findByIdAndUpdate(req.params.id, { paymentStatus: "cancelled" });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const ticket = await Ticket.findById(req.params.ticketId).populate(
      "userId",
      "name",
    );

    if (user.roles === "admin") {
      canceler = `Cancelled By Admin${ticket.userId ? ` | ${ticket.userId.name}` : ""}`;
    } else if (user.roles === "manager") {
      canceler = `Cancelled By Manager${ticket.userId ? ` | ${ticket.userId.name}` : ""}`;
    } else {
      canceler = `Cancelled By Passenger${ticket.userId ? ` | ${ticket.userId.name}` : ""}`;
    }

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    // Do NOT allow cancellation of PAID tickets
    if (ticket.paymentStatus === "paid") {
      return res.status(400).json({
        message: "Paid tickets cannot be cancelled",
      });
    }
    // Release seat ONLY if ticket was holding one
    const shouldReleaseSeat = ["reserved", "pending"].includes(
      ticket.paymentStatus,
    );

    if (shouldReleaseSeat) {
      await Program.findByIdAndUpdate(ticket.programId, {
        $inc: { paidSeatCount: -1 },
        status: "active",
      });
    }

    // Move ticket to cancelled collection
    const cancelledData = ticket.toObject();
    delete cancelledData._id;

    await CancelledTicket.create({
      ...cancelledData,
      paymentStatus: "canceled",
      reason: canceler,
      canceledAt: new Date(),
    });
    // ...Remove from ticket collection ..
    await Ticket.findByIdAndDelete(ticket._id);

    res.json({ success: true, message: "Ticket cancelled successfully" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

/** .......Pay ticket.........*/
// export const payTicket = async (req, res) => {
//   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//   try {
//     const { ticketId } = req.body;

//     // Fetch ticket from DB
//     const ticket = await Ticket.findById(ticketId)
//       .populate({
//         path: "programId",
//         populate: { path: "routId", select: "departure arrival" },
//       })
//       .populate("reservationCode");

//     if (!ticket) {
//       return res.status(404).json({ message: "Ticket not found" });
//     }

//     if (ticket.paymentStatus === "paid") {
//       return res.status(400).json({ message: "Ticket already paid" });
//     }

//     if (ticket.paymentStatus === "canceled") {
//       return res.status(400).json({ message: "Ticket is canceled" });
//     }

//     // Mark ticket as PENDING
//     // ticket.paymentStatus = "pending";
//     // await ticket.save();

//     // Safely get ticket amount in cents
//     const amountCents = Math.round(Number(ticket.programId.tarrif) * 100);

//     if (isNaN(amountCents) || amountCents <= 0) {
//       return res.status(400).json({ message: "Invalid ticket tariff" });
//     }
//     // Create Stripe Checkout Session
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       mode: "payment",

//       // Product details shown in Stripe UI
//       line_items: [
//         {
//           price_data: {
//             currency: "usd",
//             product_data: {
//               name: "Care Ticket Reservation",
//               description: `Route: ${ticket.programId.routId.departure} to ${ticket.programId.routId.arrival}, Seat: ${ticket.seatNumber}, Reservation Code: ${ticket.reservationCode}`,
//             },
//             unit_amount: amountCents, // Stripe expects cents
//           },
//           quantity: 1,
//         },
//       ],

//       metadata: {
//         paymentType: "ticket",
//         ticketId: ticket._id.toString(),
//       },

//       // Redirect URLs after payment
//       success_url: `${process.env.VITE_FRONTEND_URL}/payment_success?ticketId=${ticket._id}`,
//       cancel_url: `${process.env.VITE_FRONTEND_URL}/payment_cancel`,
//     });

//     // Send Stripe URL to frontend
//     res.json({ url: session.url });
//   } catch (err) {
//     console.log(err);
//     res.status(400).json({ message: err.message || "Payment session failed" });
//   }
// };

// ........ Dynamic Payment ......

export const payTicket = async (req, res) => {
  try {
    const { ticketId, provider } = req.body; // frontend selects provider
    const ticket = await Ticket.findById(ticketId)
      .populate({ path: "companyId", select: "companyName" })
      .populate({
        path: "programId",
        populate: { path: "routId", select: "departure arrival" },
      })
      .populate("reservationCode");
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    // ticket.paymentStatus = "pending";
    // await ticket.save();

    // switch (provider?.toLowerCase()) {
    //   case "stripe":
    //     const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    //     const session = await stripe.checkout.sessions.create({
    //       payment_method_types: ["card"],
    //       mode: "payment",
    //       line_items: [
    //         {
    //           price_data: {
    //             currency: "usd",
    //             product_data: {
    //               name: "Bus Ticket Reservation",
    //               description: `Seat ${ticket.seatNumber}, Reservation Code: ${ticket.reservationCode}`,
    //             },
    //             unit_amount: Math.round(ticket.programId.tarrif * 100),
    //           },
    //           quantity: 1,
    //         },
    //       ],
    //       metadata: { ticketId: ticket._id.toString() },
    //       success_url: `${process.env.VITE_FRONTEND_URL}/payment_success?ticketId=${ticket._id}`,
    //       cancel_url: `${process.env.VITE_FRONTEND_URL}/payment_cancel`,
    //     });
    //     return res.json({ url: session.url });

    //   case "paypal":
    //     // Call PayPal API to create order
    //     return res.json({ message: "PayPal integration here" });

    //   case "flutterwave":
    //     // Call Flutterwave API to create payment link
    //     return res.json({ message: "Flutterwave integration here" });

    //   default:
    //     return res.status(400).json({ message: "Unsupported payment provider" });
    // }
    switch (provider?.toLowerCase()) {
      case "stripe":
        return await createStripePayment(ticket, res);

      case "chapa":
        return await createChapaPayment(ticket, res);

      default:
        return res.status(400).json({
          message: "Unsupported payment provider",
        });
    }
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: err.message,
    });
  }
};

/* ..... Stripe payment function ....*/
const createStripePayment = async (ticket, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    if (ticket.paymentStatus === "paid") {
      return res.status(400).json({ message: "Ticket already paid" });
    }

    if (ticket.paymentStatus === "canceled") {
      return res.status(400).json({ message: "Ticket is canceled" });
    }
    // Safely get ticket amount in cents
    const amountCents = Math.round(Number(ticket.programId.tarrif) * 100);

    if (isNaN(amountCents) || amountCents <= 0) {
      return res.status(400).json({ message: "Invalid ticket tariff" });
    }
    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      // Product details shown in Stripe UI
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Car Ticket Reservation",
              description: `Route: ${ticket.programId.routId.departure} to ${ticket.programId.routId.arrival}, Seat: ${ticket.seatNumber}, Reservation Code: ${ticket.reservationCode}`,
            },
            unit_amount: amountCents, // Stripe expects cents
          },
          quantity: 1,
        },
      ],

      metadata: {
        paymentType: "ticket",
        ticketId: ticket._id.toString(),
      },

      // Redirect URLs after payment
      success_url: `${process.env.VITE_FRONTEND_URL}/payment_success?ticketId=${ticket._id}`,
      cancel_url: `${process.env.VITE_FRONTEND_URL}/payment_cancel`,
    });

    // Send Stripe URL to frontend
    res.json({ url: session.url });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message || "Payment session failed" });
  }
}; /* ..... Stripe payment function ....*/

/* ..... Chapa payment function ....*/
const createChapaPayment = async (ticket, res) => {
  try {
    const tx_ref = `ticket_${ticket._id}_${Date.now()}`;

    const response = await axios.post(
      process.env.CHAPA_BASE_URL,
      {
        amount: ticket.programId.tarrif,
        currency: "ETB",

        email: ticket.email,
        first_name: ticket.passengerName,

        tx_ref,

        callback_url: `${process.env.VITE_BACKEND_URL}/webhook/chapa`,

        return_url: `${process.env.VITE_FRONTEND_URL}/payment_success?ticketId=${ticket._id}`,

        customization: {
          title: "Ticket Payment",
          description: "Ticket Reservation Payment",
        },

        meta: {
          ticketId: ticket._id.toString(),
          paymentType: "ticket",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
      },
    );

    return res.json({
      url: response.data.data.checkout_url,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);

    return res.status(500).json({
      message: "Chapa payment failed",
    });
  }
}; /* ..... Chapa payment function ....*/

// ..... Get Payment info from payment success page ....

export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId)
      .populate({ path: "companyId", select: "companyName" })
      .populate({
        path: "programId",
        populate: {
          path: "routId",
        },
      });
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    // console.log(
    //   "Fetched ticket for ID:",
    //   ticket.programId.routId.departure,
    //   "→",
    //   ticket.programId.routId.arrival,
    // );

    res.json({
      companyName: ticket.companyId?.companyName,
      passengerName: ticket.passengerName,
      email: ticket.email,
      phone: ticket.phone,
      reservationCode: ticket.reservationCode,
      paidAmount: ticket.programId.tarrif,
      seatNumber: ticket.seatNumber,
      route: ticket.programId.routId
        ? `${ticket.programId.routId.departure} → ${ticket.programId.routId.arrival}`
        : "",
      paymentStatus: ticket.paymentStatus,
      paidAt: ticket.paidAt,
      payments: ticket.payments.map((p) => ({
        provider: p.provider,
        amount: p.amount,
        currency: p.currency,
        customer_name: p.customer_name,
        customer_email: p.customer_email,
        paidAt: p.paidAt,
        providerPaymentId: p.providerPaymentId,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const ticketAPI = {
  list,
  getOne,
  create,
  update,
  remove,
};
export default ticketAPI;
