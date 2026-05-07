import express from "express";
import mongoose from "mongoose";
import Tarrif from "../models/tarrifModel.js";
import Company from "../models/companyModel.js";
import Rout from "../models/routsModel.js";
import Car from "../models/carsModel.js";
import { populate } from "dotenv";

// GET /Tarrifs
const list = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    const search = req.query.search || "";

    // Get all Routs that belong to the current user in this company
    const company = await Company.find({
      _id: user.companyID,
    }).select("_id");

    const companyIds = company.map((c) => c._id);

    // $regex used to make word pattern match, I used to avoid case sensesitivity.
    const filter = search
      ? {
          // $or is a MongoDB logical operator that Match the document if ANY of these conditions is true."
          $or: [{ amount: { $regex: search, $options: "i" } }],
        }
      : {};

    const cmp = await Tarrif.find({
      companyId: { $in: companyIds },
      userId: user.id || user._id,
      ...filter,
    })
      .populate({ path: "routId", select: "departure arrival" })
      .populate({ path: "carId", select: "type level" });

    res.json(cmp);
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: "Error getting Tarrif List" });
  }
};

const getOne = async (req, res) => {
  try {
    const tarrif = await Tarrif.findById(req.params.id);
    res.json(tarrif);
  } catch (error) {
    res.status(500).json({ message: "Error getting tarrif." });
  }
};

// POST /Tarrifs
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
    const trf = await Tarrif.create(payload);
    res.json(trf);
  } catch (error) {
    console.log();
    res.status(500).json({ message: "Error creating Tarrif" });
  }
};

// PUT /Tarrifs/:id
const update = async (req, res) => {
  try {
    const updated = await Tarrif.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating Tarrif" });
  }
};

// DELETE /Tarrifs/:id
const remove = async (req, res) => {
  try {
    await Tarrif.findByIdAndDelete(req.params.id);
    res.json({ message: "Tarrif deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Tarrif" });
  }
};
// GET /tarrifs/by-route/:routId
export const getByRoute = async (req, res) => {
  try {
    const { routId } = req.params;
    const search = req.query.search || "";

  const filter = search
    ? {
        $or: [
          {amount: { $eq: isNaN(Number(search)) ? null : Number(search) }},
        ],
      }
    : {};
    const tarrifs = await Tarrif.find({ routId, ...filter }).populate("routId", "departure arrival").populate(
      "carId",
      "type level"
    );
    res.json(tarrifs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tarrifs" });
  }
};
const tarrifAPI = {
  list,
  getOne,
  create,
  update,
  remove,
};
export default tarrifAPI;
