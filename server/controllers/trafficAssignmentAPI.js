import express from "express";
import TrafficAssignment from "../models/traficAssignmentModel.js";
import Rout from "../models/routsModel.js";
import SubRout from "../models/subroutModel.js";
import TrafficPolice from "../models/traficPoliceModel.js";
import Company from "../models/companyModel.js";
// import { use } from "passport";
// GET /TrafficAssignments
const list = async (req, res) => {
  const user = req.user;
  try {
    const search = req.query.search || "";
    const query = search
      ? {
          $or: [{ details: { $regex: search, $options: "i" } }],
        }
      : {};
    const TrAss = await TrafficAssignment.find(query)
      .populate({ path: "trafficOfficerId", select: "fName mName lName phone" })
      .populate({
        path: "subrouteId",
        select: "subdeparture subarrival",
        populate: { path: "routId", select: "departure arrival" },
      });

    // console.log(
    //   "Traffic Officer: ",
    //   TrAss.map((ta) => ta.trafficOfficerId),
    // );
    res.json(TrAss);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error getting TrafficAssignments List" });
  }
};

const getOne = async (req, res) => {
  try {
    const ta = await TrafficAssignment.findById(req.params.id);
    res.json(ta);
  } catch (error) {
    res.status(500).json({ message: "Error getting Assigned traffic" });
  }
};

// POST /TrafficAssignments
const create = async (req, res) => {
  const user = req.user;
  console.log("USER:", req.user);
  try {
    const TrafAssmnt = await TrafficAssignment.create({
      ...req.body,
      companyId: user.companyID,
      userId: user.id || user._id,
    });
    res.json(TrafAssmnt);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating TrafficAssignment" });
  }
};

// PUT /TrafficAssignments/:id
const update = async (req, res) => {
  try {
    const updated = await TrafficAssignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      },
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating TrafficAssignment" });
  }
};

// DELETE /TrafficAssignments/:id
const remove = async (req, res) => {
  try {
    await TrafficAssignment.findByIdAndDelete(req.params.id);
    res.json({ message: "TrafficAssignment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting TrafficAssignment" });
  }
};

// .... get subrout by rout ...
export const subRoutByRout = async (req, res) => {
  const user = req.user;
  try {
    const rout = await Rout.find({ companyId: user.companyID }).select("_id");
    const rtd = rout.map((rtid) => rtid._id);
    if (!rtd) {
      res.json({ message: "Routs are not found." });
    }
    const getSubrout = await SubRout.find({ routId: { $in: rtd } }).populate({
      path: "routId",
      select: "departure arrival",
    });
    if (!getSubrout || getSubrout.length === 0) {
      res.json({ message: "SubRouts are not found." });
    }
    res.json(getSubrout);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching SubRouts" });
  }
};

// .... get Traffic police detail ...
export const officer = async (req, res) => {
  const user = req.user;

  try {
    const getTp = await TrafficPolice.find({ companyId: user.companyID });
    if (!getTp || getTp.length === 0) {
      res.json({ message: "Traffic Police are not found." });
    }
    res.json(getTp);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching Traffic Police" });
  }
};

const TrafficAssignmentAPI = {
  list,
  getOne,
  create,
  update,
  remove,
};
export default TrafficAssignmentAPI;
