import express from "express";
import Country from "../../models/addressModel/countryModel.js";
import State from "../../models/addressModel/stateModel.js";
// import { permissions } from "../../API/permissions.js";

// GET /States
const list = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    const search = req.query.search || "";

    // Get all owners that belong to the current user in this company
    const country = await Country.find({
      companyId: user.companyID,
      // userId: user.id, // only owners created by this user
    }).select("_id");

    const countryIds = country.map((c) => c._id);

    // console.log(countryIds);

    // $regex used to make word pattern match, I used to avoid case sensesitivity.
    const filter = search
      ? {
          // $or is a MongoDB logical operator that Match the document if ANY of these conditions is true."
          $or: [
            { _id: { $regex: search, $options: "i" } },
            { stateName: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const st = await State.find({
      companyId: user.companyID,
      countryId: { $in: countryIds },
      ...filter,
    }).populate("countryId", "cName");
    res.json(st);
  } catch (error) {
    res.status(500).json({ message: "Error getting State List" });
  }
};

// get record by ID
const getOne = async (req, res) => {
  try {
    const state = await Country.findById(req.params.id).populate(
      "_id",
      "stateName",
    ); // fetch only StateName
    res.json(state);
  } catch (error) {
    res.status(500).json({ message: "Error geting State" });
  }
};
// POST /State
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
    const stt = await State.create(payload);
    res.json(stt);
  } catch (error) {
    res.status(500).json({ message: "Error creating State" });
  }
};

// PUT /State/:id
const update = async (req, res) => {
  try {
    const updated = await State.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating State" });
  }
};

// DELETE /State/:id
const remove = async (req, res) => {
  try {
    await State.findByIdAndDelete(req.params.id);
    res.json({ message: "State deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting State" });
  }
};

const getStateByCountry = async (req, res) => {
  const user = req.user;
  const { countryId } = req.query;
  try {
    if (!countryId) {
      return res.status(400).json({ message: "countryId is required" });
    }

    const getSt = await State.find({
      companyId: user.companyID,
      countryId, // <-- filter by selected country only
    });

    res.json(getSt);
  } catch (error) {
    res.status(500).json({ message: "Error getting State by Country" });
  }
};

// Step 2: Create a default export object
const stateAPI = {
  list,
  getOne,
  create,
  update,
  remove,
  getStateByCountry,
};

export default stateAPI;
