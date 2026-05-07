import express from "express";
import Country from "../../models/addressModel/countryModel.js";
import State from "../../models/addressModel/stateModel.js";
import Zone from "../../models/addressModel/zoneModel.js";
// import { permissions } from "../../API/permissions.js";

// GET /Zone
const list = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    const search = req.query.search || "";

    // Get all States that belong to the current user in this company
    const state = await State.find({
      companyId: user.companyID,
    }).select("_id");

    const stateIds = state.map((st) => st._id);

    // console.log(countryIds);

    // $regex used to make word pattern match, I used to avoid case sensesitivity.
    const filter = search
      ? {
          // $or is a MongoDB logical operator that Match the document if ANY of these conditions is true."
          $or: [
            { _id: { $regex: search, $options: "i" } },
            { zoneName: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const st = await Zone.find({
      companyId: user.companyID,
      stateId: { $in: stateIds },
      ...filter,
    }).populate({
      path: "stateId",
      select: "stateName countryId",
      populate: {
        path: "countryId",
        select: "cName companyId",
        populate: {
          path: "companyId",
          select: "companyName ",
        },
      },
    });
    res.json(st);
  } catch (error) {
    res.status(500).json({ message: "Error getting Zone List" });
  }
};

// get record by ID
const getOne = async (req, res) => {
  try {
    const state = await Zone.findById(req.params.id).populate(
      "_id",
      "zoneName"
    ); // fetch only companyName
    res.json(state);
  } catch (error) {
    res.status(500).json({ message: "Error getting zone" });
  }
};
// POST /Zone
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
    const zn = await Zone.create(payload);
    res.json(zn);
  } catch (error) {
    res.status(500).json({ message: "Error creating Zone" });
  }
};

// PUT /Zone/:id
const update = async (req, res) => {
  try {
    const updated = await Zone.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating Zone" });
  }
};

// DELETE /Zone/:id
const remove = async (req, res) => {
  try {
    await Zone.findByIdAndDelete(req.params.id);
    res.json({ message: "Zone deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Zone" });
  }
};

const getZoneByState = async (req, res) => {
  const user = req.user;
  const { stateId } = req.query;
  try {
    if (!stateId) {
      return res.status(400).json({ message: "stateId is required" });
    }

    const getzn = await Zone.find({
      companyId: user.companyID,
      stateId, // <-- filter by selected State only
    });

    res.json(getzn);
  } catch (error) {
    res.status(500).json({ message: "Error getting one by state" });
  }
};

// Step 2: Create a default export object
const zoneAPI = {
  list,
  getOne,
  create,
  update,
  remove,
  getZoneByState,
};

export default zoneAPI;
