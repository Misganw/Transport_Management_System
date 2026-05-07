import express from "express";
import Country from "../../models/addressModel/countryModel.js";
import State from "../../models/addressModel/stateModel.js";
import Zone from "../../models/addressModel/zoneModel.js";
import Wereda from "../../models/addressModel/weredaModel.js";
// import { permissions } from "../../API/permissions.js";

// GET /Wereda
const list = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    const search = req.query.search || "";

    // Get all zones that belong to the current user in this company
    const zone = await Zone.find({
      companyId: user.companyID,
    }).select("_id");

    const zoneIds = zone.map((zn) => zn._id);

    // console.log(countryIds);

    // $regex used to make word pattern match, I used to avoid case sensesitivity.
    const filter = search
      ? {
          // $or is a MongoDB logical operator that Match the document if ANY of these conditions is true."
          $or: [
            { _id: { $regex: search, $options: "i" } },
            { weredaName: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const wrd = await Wereda.find({
      companyId: user.companyID,
      zoneId: { $in: zoneIds },
      ...filter,
    }).populate({
      path: "zoneId",
      select: "zoneName stateId",
      populate: {
        path: "stateId",
        select: "stateName countryId",
        populate: {
          path: "countryId",
          select: "cName companyId",
          populate: {
            path: "companyId",
            select: "companyName",
          },
        },
      },
    });
    res.json(wrd);
  } catch (error) {
    console.error("Wereda list error:", error);
    res.status(500).json({ message: "Error getting wereda List" });
  }
};

// get record by ID
const getOne = async (req, res) => {
  try {
    const state = await Wereda.findById(req.params.id).populate(
      "_id",
      "weredaName"
    ); // fetch only werdaName
    res.json(state);
  } catch (error) {
    res.status(500).json({ message: "Error getting wereda" });
  }
};
// POST /weredas
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
    const wrd = await Wereda.create(payload);
    res.json(wrd);
  } catch (error) {
    res.status(500).json({ message: "Error creating werda" });
  }
};

// PUT /werda/:id
const update = async (req, res) => {
  try {
    const updated = await Wereda.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating Wereda" });
  }
};

// DELETE /Wereda/:id
const remove = async (req, res) => {
  try {
    await Wereda.findByIdAndDelete(req.params.id);
    res.json({ message: "Werda deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Wereda" });
  }
};

const getWeredaByZone = async (req, res) => {
  const user = req.user;
  const { zoneId } = req.query;
  try {
    if (!zoneId) {
      return res.status(400).json({ message: "zoneId is required" });
    }

    const getwrd = await Wereda.find({
      companyId: user.companyID,
      zoneId, // <-- filter by selected zone only
    });

    res.json(getwrd);
  } catch (error) {
    res.status(500).json({ message: "Error getting one by Zone" });
  }
};

// Step 2: Create a default export object
const weredaAPI = {
  list,
  getOne,
  create,
  update,
  remove,
  getWeredaByZone,
};

export default weredaAPI;
