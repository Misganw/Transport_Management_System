import express from "express";
import Wereda from "../../models/addressModel/weredaModel.js";
import City from "../../models/addressModel/cityModel.js";
// import { permissions } from "../../API/permissions.js";

// GET /City
const list = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    const search = req.query.search || "";

    // Get all wereda that belong to the current user in this company
    const wereda = await Wereda.find({
      companyId: user.companyID,
    }).select("_id");

    const weredaIds = wereda.map((wrd) => wrd._id);

    // console.log(countryIds);

    // $regex used to make word pattern match, I used to avoid case sensesitivity.
    const filter = search
      ? {
          // $or is a MongoDB logical operator that Match the document if ANY of these conditions is true."
          $or: [
            { _id: { $regex: search, $options: "i" } },
            { cityName: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const ct = await City.find({
      companyId: user.companyID,
      weredaId: { $in: weredaIds },
      ...filter,
    }).populate({
      path: "weredaId",
      select: "weredaName zoneId",
      populate: {
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
      },
    });
    res.json(ct);
  } catch (error) {
    res.status(500).json({ message: "Error getting city List" });
  }
};

// get record by ID
const getOne = async (req, res) => {
  try {
    const state = await City.findById(req.params.id).populate(
      "_id",
      "cityName"
    ); // fetch only cityaName
    res.json(state);
  } catch (error) {
    res.status(500).json({ message: "Error getting city" });
  }
};
// POST /city
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
    const wrd = await City.create(payload);
    res.json(wrd);
  } catch (error) {
    res.status(500).json({ message: "Error creating city" });
  }
};

// PUT /city/:id
const update = async (req, res) => {
  try {
    const updated = await City.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating city" });
  }
};

// DELETE /city/:id
const remove = async (req, res) => {
  try {
    await City.findByIdAndDelete(req.params.id);
    res.json({ message: "City deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting city" });
  }
};

const getCityByWereda = async (req, res) => {
  const user = req.user;
  const { weredaId } = req.query;
  try {
    if (!weredaId) {
      return res.status(400).json({ message: "weredaId is required" });
    }

    const getcity = await City.find({
      companyId: user.companyID,
      weredaId, // <-- filter by selected wereda only
    });

    res.json(getcity);
  } catch (error) {
    res.status(500).json({ message: "Error getting one by wereda" });
  }
};

// Step 2: Create a default export object
const cityAPI = {
  list,
  getOne,
  create,
  update,
  remove,
  getCityByWereda,
};

export default cityAPI;
