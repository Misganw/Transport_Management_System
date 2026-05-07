import express from "express";
import mongoose from "mongoose";
import Rout from "../models/routsModel.js";
import Company from "../models/companyModel.js";
import Car from "../models/carsModel.js";
import Tarrif from "../models/tarrifModel.js";

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
    console.log("companyId", user.companyID);
    const companyIds = company.map((c) => c._id);

    // $regex used to make word pattern match, I used to avoid case sensesitivity.
    const filter = search
      ? {
          // $or is a MongoDB logical operator that Match the document if ANY of these conditions is true."
          $or: [
            { departure: { $regex: search, $options: "i" } },
            { arrival: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const cmp = await Rout.find({
      companyId: { $in: companyIds },
      ...filter,
    }).populate("companyId", "companyName");

    console.log("companyId", cmp[0].companyId);
    res.json(cmp);
  } catch (error) {
    res.status(500).json({ message: "Error getting Rout List" });
  }
};

const getOne = async (req, res) => {
  try {
    const rout = await Rout.findById(req.params.id);
    res.json(rout);
  } catch (error) {
    res.status(500).json({ message: "Error getting route." });
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
    const rt = await Rout.create(payload);
    res.json(rt);
  } catch (error) {
    res.status(500).json({ message: "Error creating Rout" });
  }
};

// PUT /Routs/:id
export const update = async (req, res) => {
  try {
    const updated = await Rout.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating Rout" });
  }
};

// DELETE /Routs/:id
export const remove = async (req, res) => {
  try {
    await Rout.findByIdAndDelete(req.params.id);
    res.json({ message: "Rout deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Rout" });
  }
};
export const fetchRouts = async (req, res) => {
  try {
    const routs = await Rout.find();
    res.json(routs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching routs" });
  }
};

// GET /tarrifs/by-route/:routId
export const getByRoute = async (req, res) => {
  try {
    const { routId } = req.params;
    const tarrifs = await Tarrif.find({ routId }).populate(
      "carId",
      "carType plateNumber",
    );
    res.json(tarrifs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tarrifs" });
  }
};

export const getCompany = async (req, res) => {
  try {
    const routes = await Company.find();

    res.json(routes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getRoutByCompany = async (req, res) => {
  try {
    const routes = await Rout.find({
      companyId: req.params.companyId,
    });

    res.json(routes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const searchRout = async (req, res) => {
  try {
    const { companyId, departure, arrival } = req.query;

    const filter = {};

    if (companyId) filter.companyId = companyId;
    if (departure) filter.departure = departure;
    if (arrival) filter.arrival = arrival;

    const routes = await Rout.find(filter); // optional

    res.json(routes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const routAPI = {
  list,
  getOne,
  create,
  update,
  remove,
};

export default routAPI;
