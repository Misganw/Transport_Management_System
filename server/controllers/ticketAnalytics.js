import mongoose from "mongoose";
import Violation from "../models/reportsModel.js"; // Adjust paths to your models
import Ticket from "../models/ticketsModel.js";
import Payment from "../models/PaymentsModel.js";
import PayTicket from "../models/payTicketModel.js";
import Cancelled from "../models/cancelledTicketModel.js";
import dayjs from "dayjs";

export const getTicketData = async (req, res) => {
  try {
    const user = req.user; // Retrieved from your auth middleware
    const objectIdCompanyId = new mongoose.Types.ObjectId(user.companyID);

    // Run both aggregations concurrently for peak performance
    const byStatus = await Ticket.aggregate([
      { $match: { companyId: objectIdCompanyId } },
      { $group: { _id: "$paymentStatus", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const getStatus = byStatus.map((item) => ({
      status: item._id || "Unknown",
      count: item.count,
    }));
    // console.log("Cars grouped by type:", byType);
    // Send both data arrays in a single response packet
    res.json(getStatus);
  } catch (error) {
    console.error("Error grouping cars by type:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getTicketRevenue = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    const companyId = new mongoose.Types.ObjectId(user.companyID);

    const ticketPaymentResult = await PayTicket.aggregate([
      { $match: { companyId: companyId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const ticketPaymentsTotal = ticketPaymentResult[0]?.total || 0;
    res.json(ticketPaymentsTotal);
  } catch (error) {
    console.error("Error calculating revenue stats:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getCancelledTicket = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    const companyId = new mongoose.Types.ObjectId(user.companyID);

    const cancelledResult = await Cancelled.countDocuments({
      companyId: companyId,
    });

    console.log("Count of c: ", cancelledResult);
    res.json(cancelledResult);
  } catch (error) {
    console.error("Error calculating revenue stats:", error);
    res.status(500).json({ error: error.message });
  }
};
