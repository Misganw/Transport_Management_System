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

    // console.log("Count of c: ", cancelledResult);
    res.json(cancelledResult);
  } catch (error) {
    console.error("Error calculating revenue stats:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getTicketRevenueTrends = async (req, res) => {
  try {
    const user = req.user;
    const company_Id = new mongoose.Types.ObjectId(user.companyID);

    const trends = await PayTicket.aggregate([
      { $match: { companyId: company_Id } },
      {
        $group: {
          // Group strictly by date so you get one document per day
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            method: "$paymentMethod",
          },
          // Sum up the total revenue for that day
          totalPayments: { $sum: "$amount" },
          // Count the total number of tickets/transactions for that day
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id.date",
          methods: "$_id.method",
          totalRevenue: "$totalPayments",
          count: "$count",
        },
      },
      { $sort: { date: 1 } },
    ]);

    res.json(trends);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const getTotalRevenuByMethod = async (req, res) => {
  try {
    const user = req.user;
    const company_Id = new mongoose.Types.ObjectId(user.companyID);

    const trends = await PayTicket.aggregate([
      { $match: { companyId: company_Id } },
      {
        $group: {
          // Group strictly by date so you get one document per day
          _id: "$paymentMethod",
          // Sum up the total revenue for that day
          totalPayments: { $sum: "$amount" },
          // Count the total number of tickets/transactions for that day
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          methods: "$_id",
          totalRevenue: "$totalPayments",
          count: "$count",
        },
      },
      { $sort: { date: 1 } },
    ]);
    // console.log("revenue By Methods", trends);
    res.json(trends);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
