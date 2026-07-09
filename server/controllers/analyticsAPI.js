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

const getCountWithTrend = async (Model, companyId) => {
  const todayStart = dayjs().startOf("day").toDate();
  const tomorrowStart = dayjs().add(1, "day").startOf("day").toDate();
  const yesterdayStart = dayjs().subtract(1, "day").startOf("day").toDate();

  const [count, today, yesterday] = await Promise.all([
    Model.countDocuments({ companyId }),

    Model.countDocuments({
      companyId,
      createdAt: {
        $gte: todayStart,
        $lt: tomorrowStart,
      },
    }),

    Model.countDocuments({
      companyId,
      createdAt: {
        $gte: yesterdayStart,
        $lt: todayStart,
      },
    }),
  ]);

  let trend = 0;

  if (yesterday === 0) {
    trend = today > 0 ? 100 : 0;
  } else {
    trend = Number((((today - yesterday) / yesterday) * 100).toFixed(1));
  }

  const result = {
    // model: Model.modelName,
    count,
    today,
    yesterday,
    trend,
  };

  // console.log("Analytics Result:", result);

  return result;
};

export const countCars = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    // const carCount = await Car.countDocuments({ companyId: user.companyID });
    // // console.log("Car count for company", user.companyID, ":", carCount);
    // res.json({ count: carCount });
    res.json(await getCountWithTrend(Car, req.user.companyID));
  } catch (error) {
    console.error("Error counting cars:", error);
    res.status(500).json({ error: error.message });
  }
};
export const countDrivers = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    // const driverCount = await Driver.countDocuments({
    //   companyId: user.companyID,
    // });
    // res.json({ count: driverCount });
    res.json(await getCountWithTrend(Driver, req.user.companyID));
  } catch (error) {
    console.error("Error counting drivers:", error);
    res.status(500).json({ error: error.message });
  }
};
export const countPassengers = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    // const passengerCount = await Passenger.countDocuments({
    //   companyId: user.companyID,
    // });
    // res.json({ count: passengerCount });
    res.json(await getCountWithTrend(Passenger, req.user.companyID));
  } catch (error) {
    console.error("Error counting passengers:", error);
    res.status(500).json({ error: error.message });
  }
};

export const countPrograms = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    // const programCount = await Program.countDocuments({
    //   companyId: user.companyID,
    // });
    // res.json({ count: programCount });
    res.json(await getCountWithTrend(Program, req.user.companyID));
  } catch (error) {
    console.error("Error counting programs:", error);
    res.status(500).json({ error: error.message });
  }
};
export const countTickets = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    // const ticketCount = await Ticket.countDocuments({
    //   companyId: user.companyID,
    // });
    // res.json({ count: ticketCount });
    res.json(await getCountWithTrend(Ticket, req.user.companyID));
  } catch (error) {
    console.error("Error counting tickets:", error);
    res.status(500).json({ error: error.message });
  }
};

export const countReports = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    // const reportCount = await Report.countDocuments({
    //   companyId: user.companyID,
    // });
    // res.json({ count: reportCount });
    res.json(await getCountWithTrend(Report, req.user.companyID));
  } catch (error) {
    console.error("Error counting reports:", error);
    res.status(500).json({ error: error.message });
  }
};

export const countEmployees = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    // const employeeCount = await Employee.countDocuments({
    //   companyId: user.companyID,
    // });
    // res.json({ count: employeeCount });
    res.json(await getCountWithTrend(Employee, req.user.companyID));
  } catch (error) {
    console.error("Error counting employees:", error);
    res.status(500).json({ error: error.message });
  }
};

export const countOwners = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    // const ownerCount = await Owner.countDocuments({
    //   companyId: user.companyID,
    // });
    // res.json({ count: ownerCount });
    res.json(await getCountWithTrend(Owner, req.user.companyID));
  } catch (error) {
    console.error("Error counting owners:", error);
    res.status(500).json({ error: error.message });
  }
};

export const countPayments = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    // const paymentCount = await Payment.countDocuments({
    //   companyId: user.companyID,
    // });
    // res.json({ count: paymentCount });
    res.json(await getCountWithTrend(Payment, req.user.companyID));
  } catch (error) {
    console.error("Error counting payments:", error);
    res.status(500).json({ error: error.message });
  }
};

export const countPenalities = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    // const penaltyCount = await Penalty.countDocuments({
    //   companyId: user.companyID,
    // });
    // res.json({ count: penaltyCount });
    res.json(await getCountWithTrend(Penalty, req.user.companyID));
  } catch (error) {
    console.error("Error counting penalties:", error);
    res.status(500).json({ error: error.message });
  }
};

export const countRules = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    // const ruleCount = await Rule.countDocuments({
    //   companyId: user.companyID,
    // });
    // res.json({ count: ruleCount });
    res.json(await getCountWithTrend(Rule, req.user.companyID));
  } catch (error) {
    console.error("Error counting rules:", error);
    res.status(500).json({ error: error.message });
  }
};

export const countTarrifs = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    // const tariffCount = await Tariff.countDocuments({
    //   companyId: user.companyID,
    // });
    // res.json({ count: tariffCount });
    res.json(await getCountWithTrend(Tariff, req.user.companyID));
  } catch (error) {
    console.error("Error counting tariffs:", error);
    res.status(500).json({ error: error.message });
  }
};

export const countTraffic = async (req, res) => {
  try {
    // const user = req.user; // from auth middleware
    // const trafficCount = await Traffic.countDocuments({
    //   companyId: user.companyID,
    // });
    // res.json({ count: trafficCount });
    res.json(await getCountWithTrend(Traffic, req.user.companyID));
  } catch (error) {
    console.error("Error counting traffic:", error);
    res.status(500).json({ error: error.message });
  }
};

export const countRoutes = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    // const routeCount = await Subroute.countDocuments({
    //   companyId: user.companyID,
    // });
    // res.json({ count: routeCount });
    res.json(await getCountWithTrend(Route, req.user.companyID));
  } catch (error) {
    console.error("Error counting routes:", error);
    res.status(500).json({ error: error.message });
  }
};

export const countSubroutes = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    // const subrouteCount = await Route.countDocuments({
    //   companyId: user.companyID,
    // });
    // res.json({ count: subrouteCount });
    res.json(await getCountWithTrend(Subroute, req.user.companyID));
  } catch (error) {
    console.error("Error counting subroutes:", error);
    res.status(500).json({ error: error.message });
  }
};

export const countUsers = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    // const userCount = await User.countDocuments({
    //   companyId: user.companyID,
    // });
    // res.json({ count: userCount });
    res.json(await getCountWithTrend(User, req.user.companyID));
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
      Payment.aggregate(trendPipeline),
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
      paymentStatus: "paid", // Assuming 'paid' is the status for paid tickets
    });
    res.json({ count: paidTicketsCount });
  } catch (error) {
    console.error("Error calculating paid tickets:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getTicketPaymentAnalytics = async (req, res) => {
  try {
    const user = req.user; // from auth middleware

    const company_Id = new mongoose.Types.ObjectId(user.companyID);
    const now = new Date();

    // Define starting points for time ranges
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));

    // const startOfWeek = new Date();
    // startOfWeek.setDate(now.getDate() - now.getDay()); // Start of current week (Sunday)
    // startOfWeek.setHours(0, 0, 0, 0);
    const startOfWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 7,
      0,
      0,
      0,
      0,
    );

    // const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 30,
      0,
      0,
      0,
      0,
    );
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const analytics = await Ticket.aggregate([
      { $match: { companyId: company_Id } },
      {
        $facet: {
          daily: [
            { $match: { createdAt: { $gte: startOfDay } } },
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                paid: {
                  $sum: { $cond: [{ $eq: ["$paymentStatus", "paid"] }, 1, 0] },
                },
              },
            },
          ],
          weekly: [
            { $match: { createdAt: { $gte: startOfWeek } } },
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                paid: {
                  $sum: { $cond: [{ $eq: ["$paymentStatus", "paid"] }, 1, 0] },
                },
              },
            },
          ],
          monthly: [
            { $match: { createdAt: { $gte: startOfMonth } } },
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                paid: {
                  $sum: { $cond: [{ $eq: ["$paymentStatus", "paid"] }, 1, 0] },
                },
              },
            },
          ],
          yearly: [
            { $match: { createdAt: { $gte: startOfYear } } },
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                paid: {
                  $sum: { $cond: [{ $eq: ["$paymentStatus", "paid"] }, 1, 0] },
                },
              },
            },
          ],
        },
      },
    ]);

    // Format output safely to default to 0 if no tickets exist for a time range
    const formatResult = (data) =>
      data[0]
        ? { total: data[0].total, paid: data[0].paid }
        : { total: 0, paid: 0 };

    res.json({
      daily: formatResult(analytics[0].daily),
      weekly: formatResult(analytics[0].weekly),
      monthly: formatResult(analytics[0].monthly),
      yearly: formatResult(analytics[0].yearly),
    });
  } catch (error) {
    console.error("Error calculating ticket analytics:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getMonthlyPerformanceMetrics = async (req, res) => {
  try {
    const user = req.user;
    const company_Id = new mongoose.Types.ObjectId(user.companyID);

    // Get the boundary dates for the current year (2026)
    const currentYear = new Date().getFullYear(); // 2026
    const startOfYear = new Date(`${currentYear}-01-01T00:00:00.000Z`);
    const endOfYear = new Date(`${currentYear}-12-31T23:59:59.999Z`);

    const metrics = await Ticket.aggregate([
      // 1. Fetch only tickets belonging to this company AND matching the current year
      {
        $match: {
          companyId: company_Id,
          createdAt: { $gte: startOfYear, $lte: endOfYear },
        },
      },

      // 2. Fetch matching violations from the violation collection
      {
        $lookup: {
          from: "reports", // Ensure this matches your actual collection name
          localField: "_id",
          foreignField: "ticketId",
          as: "matchedViolations",
        },
      },

      // 3. Extract the clean year-month string and count violations safely per ticket
      {
        $project: {
          monthString: {
            $dateToString: { format: "%Y-%m", date: "$createdAt" },
          },
          // Pull the raw ticket price directly from your record
          ticketPrice: { $ifNull: [{ $sum: "$payments.amount" }, 0] }, // Replace "$price" with your actual ticket cost field name
          violationCount: { $size: "$matchedViolations" },
        },
      },

      // 4. Finally group by month to sum up the totals perfectly
      {
        $group: {
          _id: "$monthString",
          tickets: { $sum: 1 }, // Counts every distinct ticket record
          revenue: { $sum: "$ticketPrice" }, // Sums the unique ticket amount safely
          violations: { $sum: "$violationCount" }, // Sums up total structural infractions
        },
      },

      {
        $project: {
          _id: 0,
          month: "$_id",
          tickets: 1,
          revenue: 1,
          violations: 1,
        },
      },
      { $sort: { month: 1 } },
    ]);

    // Map month string indexes ("2026-06") to human labels ("June 2026")
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const finalResult = metrics.map((item) => {
      const [year, monthIndex] = item.month.split("-");
      return {
        ...item,
        key: item.month,
        month: `${monthNames[parseInt(monthIndex, 10) - 1]} ${year}`,
      };
    });

    res.json(finalResult);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const getTopRoutesMetrics = async (req, res) => {
  try {
    const user = req.user;
    const company_Id = new mongoose.Types.ObjectId(user.companyID);

    const routeMetrics = await Ticket.aggregate([
      // 1. Filter tickets by company profile
      { $match: { companyId: company_Id } },

      // 2. Lookup violations tied to this specific ticket
      {
        $lookup: {
          from: "reports",
          localField: "_id",
          foreignField: "ticketId",
          as: "matchedViolations",
        },
      },

      // 3. Trace back to the Program data
      {
        $lookup: {
          from: "programs", // Adjust to the exact name of your programs collection
          localField: "programId",
          foreignField: "_id",
          as: "program",
        },
      },
      { $unwind: "$program" },

      // 4. Trace from the Program down to the Route details
      {
        $lookup: {
          from: "routs", // Adjust to the exact name of your routes collection (e.g., "routs" or "routes")
          localField: "program.routId", // Using the correct field path from your schemas
          foreignField: "_id",
          as: "routeDetails",
        },
      },
      { $unwind: "$routeDetails" },

      // 5. Structure the key identifiers before grouping
      {
        $project: {
          // Concat origin and destination names into a readable string (e.g. "Addis Ababa - Gondar")
          routeName: {
            $concat: [
              "$routeDetails.departure", // Adjust to your route model's field name (e.g. departure/startLocation)
              " - ",
              "$routeDetails.arrival", // Adjust to your route model's field name (e.g. arrival/endLocation)
            ],
          },
          violationCount: { $size: "$matchedViolations" },
        },
      },

      // 6. Group all metrics by the unique route string name
      {
        $group: {
          _id: "$routeName",
          tickets: { $sum: 1 },
          violations: { $sum: "$violationCount" },
        },
      },

      // 7. Format payload keys cleanly for Ant Design Table consumption
      {
        $project: {
          _id: 0,
          route: "$_id",
          tickets: 1,
          violations: 1,
        },
      },

      // 8. Sort by ticket performance (Highest sales at the top)
      { $sort: { tickets: -1 } },
    ]);

    // Inject an index-based unique key parameter for Ant Design rendering maps
    const formattedResult = routeMetrics.map((item, index) => ({
      ...item,
      key: `route-${index}`,
    }));

    res.json(formattedResult);
  } catch (error) {
    console.error("Top Routes Metrics Error: ", error);
    res.status(500).json({ error: error.message });
  }
};

export const getActiveProgramCarsCount = async (req, res) => {
  try {
    const user = req.user; // If scoped by company
    const objectIdCompanyId = new mongoose.Types.ObjectId(user.companyID);

    const result = await Program.aggregate([
      // 1. Filter for active programs belonging to the company
      {
        $match: {
          companyId: objectIdCompanyId,
          status: "active",
        },
      },

      // 2. Group by carId to eliminate duplicate car references across multiple active programs
      {
        $group: {
          _id: "$carId",
        },
      },

      // 3. Count total unique cars
      {
        $count: "totalActiveCars",
      },
    ]);

    // Format response payload: handle cases where count array is empty
    const totalCount = result.length > 0 ? result[0].totalActiveCars : 0;

    res.json({
      success: true,
      count: totalCount,
    });
  } catch (error) {
    console.error("Error counting active program cars:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getCarTypeCountByActiveProgram = async (req, res) => {
  try {
    const user = req.user; // Retrieved from your auth middleware
    const objectIdCompanyId = new mongoose.Types.ObjectId(user.companyID);

    const data = await Program.aggregate([
      // 1. Filter for active programs belonging to the user's company
      {
        $match: {
          companyId: objectIdCompanyId,
          status: "active",
        },
      },

      // 2. Eliminate duplicate car entries within active programs first
      {
        $group: {
          _id: "$carId",
        },
      },

      // 3. Join with the cars collection to get car details (like "type")
      {
        $lookup: {
          from: "cars", // Target collection name in MongoDB (usually lowercase plural)
          localField: "_id", // The carId from the group stage
          foreignField: "_id", // The document ID in the cars collection
          as: "carDetails",
        },
      },

      // 4. Flatten the carDetails array returned by $lookup
      { $unwind: "$carDetails" },

      // 5. Group by the car's type attribute and count them up
      {
        $group: {
          _id: "$carDetails.type",
          count: { $sum: 1 },
        },
      },

      // 6. Sort alphabetically or by highest count
      { $sort: { count: -1 } },
    ]);

    // Format the data cleanly for the frontend charts
    const formattedData = data.map((item) => ({
      type: item._id || "Unknown",
      count: item.count,
    }));

    res.json(formattedData);
  } catch (error) {
    console.error("Error fetching active cars by type:", error);
    res.status(500).json({ error: error.message });
  }
};
