import mongoose from "mongoose";
import Violation from "../models/reportsModel.js"; // Adjust paths to your models
import Penality from "../models/penalityModel.js";

export const getPenaltyKPIMetrics = async (req, res) => {
  try {
    const user = req.user;
    const company_Id = new mongoose.Types.ObjectId(user.companyID);

    const metrics = await Penalty.aggregate([
      // 1. Filter by company first
      { $match: { companyId: company_Id } },

      // 2. Use $facet to split processing for counts and financial metrics
      {
        $facet: {
          // KPI 1: Unique drivers whose status is 'punished'
          punishedDrivers: [
            { $match: { status: "punished" } },
            { $group: { _id: "$driverID" } },
            { $count: "total" },
          ],

          // KPI 2: Total penalty records that are 'opened'
          openedPenalties: [
            { $match: { status: "opened" } },
            { $count: "total" },
          ],

          // KPI 3: Total penalty records that are 'paid'
          paidPenalties: [{ $match: { status: "paid" } }, { $count: "total" }],

          // FINANCIALS: Accumulate totals for all penalties vs paid penalties
          financialTotals: [
            {
              $group: {
                _id: null,
                // Sum of every single penalty record amount issued
                totalPenaltyAmount: { $sum: "$amount" },
                // Conditional sum: Only add amount if the status is exactly 'paid'
                totalPaidAmount: {
                  $sum: {
                    $cond: [{ $eq: ["$status", "paid"] }, "$amount", 0],
                  },
                },
              },
            },
          ],
        },
      },

      // 3. Reshape everything into a flat, production-ready object layout
      {
        $project: {
          punishedDriversCount: {
            $ifNull: [{ $arrayElemAt: ["$punishedDrivers.total", 0] }, 0],
          },
          openedPenaltiesCount: {
            $ifNull: [{ $arrayElemAt: ["$openedPenalties.total", 0] }, 0],
          },
          paidPenaltiesCount: {
            $ifNull: [{ $arrayElemAt: ["$paidPenalties.total", 0] }, 0],
          },
          totalPenaltyAmount: {
            $ifNull: [
              { $arrayElemAt: ["$financialTotals.totalPenaltyAmount", 0] },
              0,
            ],
          },
          totalPaidAmount: {
            $ifNull: [
              { $arrayElemAt: ["$financialTotals.totalPaidAmount", 0] },
              0,
            ],
          },
        },
      },
    ]);

    const result = metrics[0] || {
      punishedDriversCount: 0,
      openedPenaltiesCount: 0,
      paidPenaltiesCount: 0,
      totalPenaltyAmount: 0,
      totalPaidAmount: 0,
    };

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching penalty financials and KPIs:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getSubrouteViolationTrends = async (req, res) => {
  try {
    const user = req.user;
    const company_Id = new mongoose.Types.ObjectId(user.companyID);

    const trends = await Violation.aggregate([
      { $match: { companyId: company_Id } },
      {
        $lookup: {
          from: "traficassignments",
          localField: "officerAssignmentId",
          foreignField: "_id",
          as: "assignment",
        },
      },
      { $unwind: "$assignment" },
      {
        $lookup: {
          from: "subrouts",
          localField: "assignment.subrouteId",
          foreignField: "_id",
          as: "subroute",
        },
      },
      { $unwind: "$subroute" },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            subroute: {
              $concat: [
                "$subroute.subdeparture",
                " - ",
                "$subroute.subarrival",
              ],
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id.date",
          subroute: "$_id.subroute",
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

export const getVoilationTrend = async (req, res) => {
  try {
    const user = req.user;
    const company_Id = new mongoose.Types.ObjectId(user.companyID);

    const trends = await Violation.aggregate([
      { $match: { companyId: company_Id } },
      {
        $lookup: {
          from: "rules",
          localField: "ruleID",
          foreignField: "_id",
          as: "voiationType",
        },
      },
      { $unwind: "$voiationType" },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            ruleType: "$voiationType.title",
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id.date",
          violatedRules: "$_id.ruleType",
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

export const countViolatedRule = async (req, res) => {
  try {
    const user = req.user;
    const company_Id = new mongoose.Types.ObjectId(user.companyID);

    const trends = await Violation.aggregate([
      { $match: { companyId: company_Id } },
      {
        $lookup: {
          from: "rules",
          localField: "ruleID",
          foreignField: "_id",
          as: "voiationType",
        },
      },
      { $unwind: "$voiationType" },
      {
        $group: {
          _id: { ruleType: "$voiationType.title" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: "$_id.ruleType",
          violatedRules: "$_id.ruleType",
          count: "$count",
        },
      },
      { $sort: { count: 1 } },
    ]);
    // console.log("N0# of Violated rules", trends);
    res.json(trends);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const getTotalVoilationByRoute = async (req, res) => {
  try {
    const user = req.user;
    const company_Id = new mongoose.Types.ObjectId(user.companyID);

    const trends = await Violation.aggregate([
      { $match: { companyId: company_Id } },
      {
        $lookup: {
          from: "traficassignments",
          localField: "officerAssignmentId",
          foreignField: "_id",
          as: "assignment",
        },
      },
      { $unwind: "$assignment" },
      {
        $lookup: {
          from: "subrouts",
          localField: "assignment.subrouteId",
          foreignField: "_id",
          as: "subroute",
        },
      },
      { $unwind: "$subroute" },
      {
        $lookup: {
          from: "routs",
          localField: "subroute.routId",
          foreignField: "_id",
          as: "route",
        },
      },
      { $unwind: "$route" },
      {
        $group: {
          _id: {
            route: {
              $concat: ["$route.departure", " - ", "$route.arrival"],
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: "$_id.route",
          route: "$_id.route",
          count: "$count",
        },
      },
      { $sort: { count: 1 } },
    ]);
    // console.log("N0# of Violated rules by Rout", trends);
    res.json(trends);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
