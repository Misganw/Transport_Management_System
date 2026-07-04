import express from "express";
import mongoose from "mongoose";
import Company from "../models/companyModel.js";
import User from "../models/userModel.js";
import Driver from "../models/driversModel.js";
import Car from "../models/carsModel.js";
import Program from "../models/programsModel.js";
import Ticket from "../models/ticketsModel.js";
import Report from "../models/reportsModel.js";
import Owner from "../models/ownersModel.js";
import Route from "../models/routsModel.js";
import Subroute from "../models/subroutModel.js";
import Payment from "../models/paymentsModel.js";
import Passenger from "../models/passengersModel.js";
import Penalty from "../models/penalityModel.js";
import Rule from "../models/rulesModel.js";
import Tariff from "../models/tarrifModel.js";
import Traffic from "../models/traficPoliceModel.js";
import Employee from "../models/employeeModel.js";
import PayTicket from "../models/payTicketModel.js";
import LiveTracking from "../models/LiveTruckingModel.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import axios from "axios";
import getUserID from "../middleware/middleware.js";

export const countCars = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    const carCount = await Car.countDocuments({ companyId: user.companyID });

    // console.log("Car count for company", user.companyID, ":", carCount);
    res.json({ count: carCount });
  } catch (error) {
    console.error("Error counting cars:", error);
    res.status(500).json({ error: error.message });
  }
};
export const countDrivers = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    const driverCount = await Driver.countDocuments({
      companyId: user.companyID,
    });
    res.json({ count: driverCount });
  } catch (error) {
    console.error("Error counting drivers:", error);
    res.status(500).json({ error: error.message });
  }
};
export const countPassengers = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    const passengerCount = await Passenger.countDocuments({
      companyId: user.companyID,
    });
    res.json({ count: passengerCount });
  } catch (error) {
    console.error("Error counting passengers:", error);
    res.status(500).json({ error: error.message });
  }
};

export const countPrograms = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    const programCount = await Program.countDocuments({
      companyId: user.companyID,
    });
    res.json({ count: programCount });
  } catch (error) {
    console.error("Error counting programs:", error);
    res.status(500).json({ error: error.message });
  }
};
export const countTickets = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    const ticketCount = await Ticket.countDocuments({
      companyId: user.companyID,
    });
    res.json({ count: ticketCount });
  } catch (error) {
    console.error("Error counting tickets:", error);
    res.status(500).json({ error: error.message });
  }
};

export const countReports = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    const reportCount = await Report.countDocuments({
      companyId: user.companyID,
    });
    res.json({ count: reportCount });
  } catch (error) {
    console.error("Error counting reports:", error);
    res.status(500).json({ error: error.message });
  }
};

export const countEmployees = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    const employeeCount = await Employee.countDocuments({
      companyId: user.companyID,
    });
    res.json({ count: employeeCount });
  } catch (error) {
    console.error("Error counting employees:", error);
    res.status(500).json({ error: error.message });
  }
};

export const countOwners = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    const ownerCount = await Owner.countDocuments({
      companyId: user.companyID,
    });
    res.json({ count: ownerCount });
  } catch (error) {
    console.error("Error counting owners:", error);
    res.status(500).json({ error: error.message });
  }
};

export const countPayments = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    const paymentCount = await Payment.countDocuments({
      companyId: user.companyID,
    });
    res.json({ count: paymentCount });
  } catch (error) {
    console.error("Error counting payments:", error);
    res.status(500).json({ error: error.message });
  }
};

export const countPenalities = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    const penaltyCount = await Penalty.countDocuments({
      companyId: user.companyID,
    });
    res.json({ count: penaltyCount });
  } catch (error) {
    console.error("Error counting penalties:", error);
    res.status(500).json({ error: error.message });
  }
};

export const countRules = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    const ruleCount = await Rule.countDocuments({
      companyId: user.companyID,
    });
    res.json({ count: ruleCount });
  } catch (error) {
    console.error("Error counting rules:", error);
    res.status(500).json({ error: error.message });
  }
};

export const countTarrifs = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    const tariffCount = await Tariff.countDocuments({
      companyId: user.companyID,
    });
    res.json({ count: tariffCount });
  } catch (error) {
    console.error("Error counting tariffs:", error);
    res.status(500).json({ error: error.message });
  }
};

export const countTraffic = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    const trafficCount = await Traffic.countDocuments({
      companyId: user.companyID,
    });
    res.json({ count: trafficCount });
  } catch (error) {
    console.error("Error counting traffic:", error);
    res.status(500).json({ error: error.message });
  }
};

export const countRoutes = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    const routeCount = await Subroute.countDocuments({
      companyId: user.companyID,
    });
    res.json({ count: routeCount });
  } catch (error) {
    console.error("Error counting routes:", error);
    res.status(500).json({ error: error.message });
  }
};

export const countSubroutes = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    const subrouteCount = await Route.countDocuments({
      companyId: user.companyID,
    });
    res.json({ count: subrouteCount });
  } catch (error) {
    console.error("Error counting subroutes:", error);
    res.status(500).json({ error: error.message });
  }
};

export const countUsers = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    const userCount = await User.countDocuments({
      companyId: user.companyID,
    });
    res.json({ count: userCount });
  } catch (error) {
    console.error("Error counting users:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ........ end of count functions ........ */

export const getTotalRevenue = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    const companyId = new mongoose.Types.ObjectId(user.companyID);

    // Run both aggregations in parallel for better performance
    const [paymentResult, ticketPaymentResult] = await Promise.all([
      // 1. Sum up regular payments
      Payment.aggregate([
        { $match: { companyId: companyId } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),

      // 2. Sum up ticket payments
      PayTicket.aggregate([
        { $match: { companyId: companyId } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    // Extract totals safely (defaulting to 0 if no documents match)
    const generalPaymentsTotal = paymentResult[0]?.total || 0;
    const ticketPaymentsTotal = ticketPaymentResult[0]?.total || 0;

    // Combined revenue
    const overallTotalRevenue = generalPaymentsTotal + ticketPaymentsTotal;

    // console.log("Revenue stats for company", generalPaymentsTotal);
    // Send data back to your dashboard
    res.json({
      count: overallTotalRevenue,
    });
  } catch (error) {
    console.error("Error calculating revenue stats:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getCarsGroupedByType = async (req, res) => {
  try {
    const user = req.user; // Retrieved from your auth middleware
    const objectIdCompanyId = new mongoose.Types.ObjectId(user.companyID);

    // Run both aggregations concurrently for peak performance
    const [typeGroups, levelGroups] = await Promise.all([
      // 1. Group by Type
      Car.aggregate([
        { $match: { companyId: objectIdCompanyId } },
        { $group: { _id: "$type", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      // 2. Group by Level
      Car.aggregate([
        { $match: { companyId: objectIdCompanyId } },
        { $group: { _id: "$level", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    // 3. Format type data for frontend
    const byType = typeGroups.map((item) => ({
      type: item._id || "Unknown",
      count: item.count,
    }));

    // 4. Format level data for frontend
    const byLevel = levelGroups.map((item) => ({
      level: item._id || "Unknown",
      count: item.count,
    }));
    // console.log("Cars grouped by type:", byType);
    // Send both data arrays in a single response packet
    res.json({ byType, byLevel });
  } catch (error) {
    console.error("Error grouping cars by type:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getPaymentTrends = async (req, res) => {
  try {
    const user = req.user;
    const objectIdCompanyId = new mongoose.Types.ObjectId(user.companyID);

    // Common aggregation pipeline stage for grouping by Date (YYYY-MM-DD)
    const trendPipeline = [
      { $match: { companyId: objectIdCompanyId } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          totalAmount: { $sum: { $toDouble: "$amount" } }, // Safely handles strings or numbers
        },
      },
      { $sort: { _id: 1 } }, // Sort chronologically
    ];

    // Run both aggregations in parallel
    const [penaltyData, ticketData] = await Promise.all([
      Penalty.aggregate(trendPipeline),
      PayTicket.aggregate(trendPipeline),
    ]);

    // Format into lookup objects for easy merging: { "2026-07-01": 500 }
    const penaltyMap = penaltyData.reduce((acc, item) => {
      acc[item._id] = item.totalAmount;
      return acc;
    }, {});

    const ticketMap = ticketData.reduce((acc, item) => {
      acc[item._id] = item.totalAmount;
      return acc;
    }, {});

    // Collect all unique dates from both sets to form a continuous X-axis timeline
    const allDates = Array.from(
      new Set([...Object.keys(penaltyMap), ...Object.keys(ticketMap)]),
    ).sort();

    // Compile into final multi-series trend structure
    const timelineData = allDates.map((date) => ({
      date,
      penalties: penaltyMap[date] || 0,
      tickets: ticketMap[date] || 0,
    }));

    res.json(timelineData);
  } catch (error) {
    console.error("Error calculating payment trends:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getpaidTickets = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    const paidTicketsCount = await Ticket.countDocuments({
      companyId: user.companyID,
      isPaid: true,
    });
    res.json({ count: paidTicketsCount });
  } catch (error) {
    console.error("Error calculating paid tickets:", error);
    res.status(500).json({ error: error.message });
  }
};
