import mongoose from "mongoose";
import Violation from "../models/reportsModel.js"; // Adjust paths to your models

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
