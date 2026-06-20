import express from "express";
import Penality from "../models/penalityModel.js";
import Company from "../models/companyModel.js";
import Report from "../models/reportsModel.js";
import Stripe from "stripe";
import { populate } from "dotenv";
import axios from "axios";

// Helper to generate reservation code
function payment_Code() {
  // return Math.random().toString(36).substring(2, 10).toUpperCase();
  return Math.random()
    .toString(36)
    .replace(/[^a-z]/g, "")
    .substring(0, 6)
    .toUpperCase();
}

// GET /Penalities
const list = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    const search = req.query.search || "";

    // $regex used to make word pattern match, I used to avoid case sensesitivity.
    const filter = search
      ? {
          // $or is a MongoDB logical operator that Match the document if ANY of these conditions is true."
          $or: [
            { reason: { $regex: search, $options: "i" } },
            { status: { $regex: search, $options: "i" } },
          ],
        }
      : {};
    const Penalities = await Penality.find({
      ...filter,
    });
    res.json(Penalities);
  } catch (error) {
    res.status(500).json({ message: "Error getting Penalities List" });
  }
};

const getOne = async (req, res) => {
  try {
    const penality = await Penality.findById(req.params.id);
    res.json({ penality });
  } catch (error) {
    res.status(500).json({ message: "Error getting Penality" });
  }
};

// POST /Penalities
const create = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    const payload = {
      ...req.body,
      companyId: user.companyID,
      userId: user.id || user._id,
      paymentCode: payment_Code(),
    };

    const createPenality = await Penality.create(payload);

    await Report.findByIdAndUpdate(payload.reportId, {
      Status: "punished",
    });
    res.json(createPenality);
  } catch (error) {
    res.status(500).json({ message: "Error creating Penality" });
  }
};

// PUT /Penalities/:id
const update = async (req, res) => {
  try {
    const updated = await Penality.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating Penality" });
  }
};

// DELETE /Penalities/:id
const remove = async (req, res) => {
  try {
    await Penality.findByIdAndDelete(req.params.id);
    res.json({ message: "Penality deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Penality" });
  }
};

// ..... Get Payment info from payment success page ....
export const getPenalityById = async (req, res) => {
  try {
    const penality = await Penality.findById(req.params.penalityId)
      .populate({ path: "companyId", select: "companyName" })
      .populate({
        path: "driverId",
        select: "fName mName lName CDL email, phone",
      })
      .populate({ path: "userId", select: "name" })
      .populate({
        path: "reportId",
        populate: [
          {
            path: "officerAssignmentId",
            populate: [
              { path: "trafficOfficerId", select: "fName mName lName" },
              { path: "subrouteId", select: "subdeparture subarrival" },
            ],
          },
          {
            path: "ticketId",
            populate: {
              path: "programId",
              populate: [
                {
                  path: "carId",
                  select: "type model level plateNumber",
                },
                { path: "routId", select: "arrival departure" },
              ],
            },
          },
        ],
      });
    if (!penality)
      return res.status(404).json({ message: "Penality not found" });
    // console.log(
    //   "Fetched penality for ID:",
    //   penality.programId.routId.departure,
    //   "→",
    //   penality.programId.routId.arrival,
    // );

    res.json({
      companyName: penality.companyId?.companyName,
      driverInfo: penality.driverId
        ? `${penality.driverId.fName} ${penality.driverId.mName} ${penality.driverId.lName}`
        : "N/A",
      email: penality.reportId?.ticketId?.email,
      phone: penality.reportId?.ticketId?.phone,
      paymentCode: penality.paymentCode,
      amount: penality.amount,
      setBy: penality.userId?.name,
      route: penality.reportId?.officerAssignmentId?.subrouteId
        ? `${penality.reportId?.officerAssignmentId?.subrouteId?.subdeparture} → ${penality.reportId?.officerAssignmentId?.subrouteId?.subarrival}`
        : "",
      status: penality.status,
      paidAt: penality.paidAt,
      dateInfo: penality.createdAt.toISOString().split("T")[0],
      payments: penality.payments.map((p) => ({
        provider: p.provider,
        amount: p.amount,
        currency: p.currency,
        customer_name: p.customer_name,
        customer_email: p.customer_email,
        paidAt: p.paidAt,
        providerPaymentId: p.providerPaymentId,
      })),
      statusInfo: penality.status || "NA",
      reporterInfo: `${penality.userId?.name}|${penality.ueserId?.roles}`,
      reportedByInfo: `${penality.reportId?.ticketId?.passengerId?.fName}   ${penality.reportId?.ticketId?.passengerId?.mName}`,
      officerInfo: `${penality.reportId?.officerAssignmentId?.trafficOfficerId?.fName}   ${penality.reportId?.officerAssignmentId?.trafficOfficerId?.mName}`,
      officerEmail:
        penality.reportId?.officerAssignmentId?.trafficOfficerId?.email || "NA",
      officerPhone:
        penality.reportId?.officerAssignmentId?.trafficOfficerId?.phone || "NA",
      ruleInfo: penality.ruleID?.title || "NA",
      driverInfo: `${penality.driverId?.fName} '' ${penality.driverId?.mName}`,
      CDLInfo: penality.driverId?.CDL || "NA",
      driverPhone: penality.driverId?.phone || "NA",
      routInfo: `${penality.reportId?.ticketId?.programId?.routId?.departure} <- -> ${penality.reportId?.ticketId?.programId?.routId?.arrival}`,
      subroutInfo: `${penality.reportId?.officerAssignmentId?.subrouteId?.subdeparture} '<- ->' ${penality.reportId?.officerAssignmentId?.subrouteId?.subarrival}`,
      carInfo: `${penality.reportId?.ticketId?.programId?.carId?.type} | ${penality.reportId?.ticketId?.programId?.carId?.level} | ${penality.reportId?.ticketId?.programId?.carId?.plateNumber}`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// List all Penalities for a specific Report
export const listPenalityByReport = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    const { reportId } = req.params;

    if (!reportId) {
      return res.status(400).json({ error: "Report ID is required" });
    }

    // Get all Reports that belong to the current user in this company
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

    const penalities = await Penality.find({ reportId, ...qry })
      .populate({ path: "companyId", select: "companyName" })
      .populate({ path: "userId", select: "name" }) // the person who punished the penality
      .populate({
        path: "reportId",
        populate: [
          { path: "userId", select: "name" },
          {
            path: "officerAssignmentId",
            populate: [
              { path: "trafficOfficerId", select: "fName mName lName" },
              { path: "subrouteId", select: "subdeparture subarrival" },
            ],
          },
          {
            path: "ticketId",
            populate: {
              path: "programId",
              populate: {
                path: "carId",
                select: "type model level plateNumber",
              },
            },
          },
        ],
      });
    // res.json(penalities);
    // console.log("Fetched penalities for report:", reportId, penalities.length);
    res.json(Array.isArray(penalities) ? penalities : []); // ensure it's always an array
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch penalities" });
  }
};

/** .......Pay Penality.........*/
// export const payPenality = async (req, res) => {
//   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//   try {
//     const { penalityId } = req.body;

//     // Fetch Penality from DB
//     const penality = await Penality.findById(penalityId)
//       .populate({ path: "companyId", select: "companyName" })
//       .populate({ path: "userId", select: "name" }) // the person who punished the penality
//       .populate({
//         path: "reportId",
//         populate: [
//           {
//             path: "officerAssignmentId",
//             populate: [
//               { path: "trafficOfficerId", select: "fName mName lName" },
//               { path: "subrouteId", select: "subdeparture subarrival" },
//             ],
//           },
//           {
//             path: "ticketId",
//             populate: {
//               path: "programId",
//               populate: {
//                 path: "carId",
//                 select: "type model level plateNumber",
//               },
//             },
//           },
//         ],
//       });

//     if (!penality) {
//       return res.status(404).json({ message: "Penality not found" });
//     }

//     if (penality.status === "paid") {
//       return res.status(400).json({ message: "Penality already paid" });
//     }

//     if (penality.status === "canceled") {
//       return res.status(400).json({ message: "Penality is canceled" });
//     }

//     // Mark penality as PENDING
//     // penality.paymentStatus = "pending";
//     // await penality.save();

//     // Safely get penality amount in cents
//     const amountCents = Math.round(Number(penality.amount) * 100);

//     if (isNaN(amountCents) || amountCents <= 0) {
//       return res.status(400).json({ message: "Invalid penality tariff" });
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
//               name: "Penality Payment",
//               description: `Route: ${penality.reportId.officerAssignmentId.subrouteId.subdeparture} to ${penality.reportId.officerAssignmentId.subrouteId.subarrival}, Car Info: ${penality.reportId?.ticketId?.programId?.carId ? `${penality.reportId.ticketId.programId.carId.type} ${penality.reportId.ticketId.programId.carId.model}` : "N/A"}, Penality Code: ${penality.paymentCode}`,
//             },
//             unit_amount: amountCents, // Stripe expects cents
//           },
//           quantity: 1,
//         },
//       ],

//       metadata: {
//         paymentType: "penality",
//         penalityId: penality._id.toString(),
//       },

//       // Redirect URLs after payment
//       success_url: `${process.env.VITE_FRONTEND_URL}/payment_success?penalityId=${penality._id}`,
//       cancel_url: `${process.env.VITE_FRONTEND_URL}/payment_cancel`,
//     });

//     // Send Stripe URL to frontend
//     res.json({ url: session.url });
//   } catch (err) {
//     console.log(err);
//     res.status(400).json({ message: err.message || "Payment session failed" });
//   }
// };

export const payPenality = async (req, res) => {
  try {
    const { penalityId, provider } = req.body; // frontend selects provider
    // Fetch Penality from DB
    const penality = await Penality.findById(penalityId)
      .populate({ path: "companyId", select: "companyName" })
      .populate({ path: "userId", select: "name" }) // the person who punished the penality
      .populate({
        path: "reportId",
        populate: [
          {
            path: "officerAssignmentId",
            populate: [
              { path: "trafficOfficerId", select: "fName mName lName" },
              { path: "subrouteId", select: "subdeparture subarrival" },
            ],
          },
          {
            path: "ticketId",
            populate: {
              path: "programId",
              populate: {
                path: "carId",
                select: "type model level plateNumber",
              },
            },
          },
        ],
      });

    if (!penality)
      return res.status(404).json({ message: "Penality not found" });

    switch (provider?.toLowerCase()) {
      case "stripe":
        return await createStripePayment(penality, res);

      case "chapa":
        return await createChapaPayment(penality, res);

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
const createStripePayment = async (penality, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    if (penality.status === "paid") {
      return res.status(400).json({ message: "Penality already paid" });
    }

    if (penality.status === "canceled") {
      return res.status(400).json({ message: "Penality is canceled" });
    }
    // Safely get penality amount in cents
    const amountCents = Math.round(Number(penality.amount) * 100);

    if (isNaN(amountCents) || amountCents <= 0) {
      return res.status(400).json({ message: "Invalid penality tariff" });
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
              name: "Penality",
              description: `Route: ${penality.reportId.officerAssignmentId.subrouteId.subdeparture} to ${penality.reportId.officerAssignmentId.subrouteId.subarrival}, Car Info: ${penality.reportId?.ticketId?.programId?.carId ? `${penality.reportId.ticketId.programId.carId.type} ${penality.reportId.ticketId.programId.carId.model}` : "N/A"}, Penality Code: ${penality.paymentCode}`,
            },
            unit_amount: amountCents, // Stripe expects cents
          },
          quantity: 1,
        },
      ],

      metadata: {
        paymentType: "penality",
        penalityId: penality._id.toString(),
      },

      // Redirect URLs after payment
      success_url: `${process.env.VITE_FRONTEND_URL}/payment_success?penalityId=${penality._id}`,
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
const createChapaPayment = async (penality, res) => {
  try {
    const tx_ref = `penality_${penality._id}_${Date.now()}`;

    const payload = {
      amount: penality.amount,
      currency: "ETB",

      email: penality.email,
      first_name: penality.passengerName,

      tx_ref,

      callback_url: `${process.env.CHAPA_GROK_URL}/webhook/chapa`,

      return_url: `${process.env.VITE_FRONTEND_URL}/payment_success?penalityId=${penality._id}`,

      customization: {
        title: "Penality Payment",
        description: "Penality Payment",
      },

      meta: {
        penalityId: penality._id.toString(),
        paymentType: "penality",
      },
    };

    const response = await axios.post(process.env.CHAPA_BASE_URL, payload, {
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });
    const chapaData = response.data;
    // console.log("Chapa payment response:", chapaData);
    return res.json({
      url: chapaData.data.checkout_url,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);

    return res.status(500).json({
      message: "Chapa payment failed",
    });
  }
}; /* ..... Chapa payment function ....*/

/** ..........Cancel Penality.........*/
export const cancelPenality = async (req, res) => {
  const user = req.user; // from auth middleware
  let canceler = "";

  try {
    // await Ticket.findByIdAndUpdate(req.params.id, { paymentStatus: "cancelled" });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const penality = await Penality.findById(req.params.penalityId).populate(
      "userId",
      "name",
    );

    if (user.roles === "admin") {
      canceler = `Cancelled By Admin${penality.userId ? ` | ${penality.userId.name}` : ""}`;
    } else if (user.roles === "manager") {
      canceler = `Cancelled By Manager${penality.userId ? ` | ${penality.userId.name}` : ""}`;
    } else if (user.roles === "officer") {
      canceler = `Cancelled By Officer${penality.userId ? ` | ${penality.userId.name}` : ""}`;
    } else {
      canceler = `Cancelled By Passenger${penality.userId ? ` | ${penality.userId.name}` : ""}`;
    }

    if (!penality) {
      return res.status(404).json({ message: "Penality not found" });
    }
    // Do NOT allow cancellation of PAID penality
    if (penality.status === "paid") {
      return res.status(400).json({
        message: "Paid penality cannot be cancelled",
      });
    }
    // Release seat ONLY if ticket was holding one
    const shouldReleaseSeat = ["opened", "pending"].includes(penality.status);

    if (shouldReleaseSeat) {
      await Program.findByIdAndUpdate(penality.programId, {
        $inc: { paidSeatCount: -1 },
        status: "active",
      });
    }

    // Move penality to cancelled collection
    const cancelledData = penality.toObject();
    delete cancelledData._id;

    await CancelledPenality.create({
      ...cancelledData,
      status: "canceled",
      reason: canceler,
      canceledAt: new Date(),
    });
    // ...Remove from penality collection ..
    await Penality.findByIdAndDelete(penality._id);

    res.json({ success: true, message: "Penality cancelled successfully" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

const penalityAPI = {
  list,
  getOne,
  create,
  update,
  remove,
};

export default penalityAPI;
