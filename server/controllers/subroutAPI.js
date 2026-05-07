import express from "express";
import mongoose from "mongoose";
import Rout from "../models/routsModel.js";
import Company from "../models/companyModel.js";
import Subrout from "../models/subroutModel.js";

// GET /Routs
const list = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    const search = req.query.search || "";

    // Get all Routs that belong to the current user in this company
    const company = await Company.find({
      _id: user.companyID,
    }).select("_id");
    // console.log(company);

    const companyIds = company.map((c) => c._id);
    // console.log(companyIds);

    // $regex used to make word pattern match, I used to avoid case sensesitivity.
    const filter = search
      ? {
          // $or is a MongoDB logical operator that Match the document if ANY of these conditions is true."
          $or: [
            { subdeparture: { $regex: search, $options: "i" } },
            { subarrival: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const rt = await Subrout.find({
      companyId: { $in: companyIds },
      ...filter,
    })
      .populate("companyId", "companyName")
      .populate("routId", "departure arrival")
      .populate("userId", "email name");
    res.json(rt);
  } catch (error) {
    res.status(500).json({ message: "Error getting Subrout List" });
  }
};

export const getRout = async (req, res) => {
  const user = req.user;
  // console.log("User in getSubroutByRout:", user);
  try {
    const getSt = await Rout.find({
      companyId: user.companyID,
      userId: user.id || user._id,
    })
      .populate("companyId", "companyName")
      .populate("_id", "departure arrival");
    if (!getSt) {
      return res
        .status(404)
        .json({ message: "No subrouts found for this route" });
    }
    // console.log("Company Name:", getSt[0].companyId.companyName);

    res.json(getSt);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error getting State by Country" });
  }
};
export const getRoutBySubrout = async (req, res) => {
  const user = req.user;
  const { subroutId } = req.params;
  try {
    const comp = await Company.find({ _id: user.companyID }).select("_id");
    const mapcompId = comp.map((cId) => cId._id);
    const getRoutFromSubrout = await Subrout.findOne({
      companyId: { $in: mapcompId },
      _id: subroutId,
    }).populate("routId", "departure arrival");
    if (!getRoutFromSubrout) {
      return res.status(404).json({ message: "Subrout not found" });
    }
    res.json([getRoutFromSubrout.routId]);
  } catch (error) {
    res.status(500).json({ message: "Error geting Rout by Subrout" });
  }
};

const getOne = async (req, res) => {
  try {
    const rout = await Rout.findById(req.params.id);
    res.json(rout);
  } catch (error) {
    res.status(500).json({ message: "Error getting subroute." });
  }
};

// POST /Routs
const create = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    if (!user || !user.companyID) {
      return res
        .status(400)
        .json({ message: "Authenticated user missing companyId" });
    }

    const payload = {
      ...req.body,
      companyId: user.companyID,
      userId: user.id || user._id,
    };
    const rt = await Subrout.create(payload);
    res.json(rt);
    req.app.get("io").emit("subroutCreated", rt);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error creating Subrout", error: error.message });
  }
};

// PUT /Routs/:id
export const update = async (req, res) => {
  try {
    const updated = await Subrout.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating Subrout", error: error.message });
  }
};

// DELETE /Routs/:id
export const remove = async (req, res) => {
  try {
    await Subrout.findByIdAndDelete(req.params.id);
    res.json({ message: "Subrout deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting Subrout", error: error.message });
  }
};

const subroutAPI = {
  list,
  getOne,
  create,
  update,
  remove,
};

export default subroutAPI;
