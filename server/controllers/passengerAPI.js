import express from "express";
import Passenger from "../models/passengersModel.js";
import Company from "../models/companyModel.js";
import e from "express";

// GET /Passengers
const list = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    const search = req.query.search || "";

    // Get all Programs that belong to the current user in this company
    const company = await Company.find({
      _id: user.companyID,
    }).select("_id");
    // console.log("user Id:", user.id);
    const companyIds = company.map((c) => c._id);

    // $regex used to make word pattern match, I used to avoid case sensesitivity.
    const filter = search
      ? {
          $or: [
            { fName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { mName: { $regex: search, $options: "i" } },
            { lName: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    // Base query
    let qry = {
      companyId: { $in: companyIds },
      ...filter,
    };

    // Restrict if user is passenger
    if (user.roles === "passenger") {
      qry.userId = user.id;
      // assuming Passenger.userId references the logged-in user
    }

    const Passengers = await Passenger.find(qry)
      .sort({ createdAt: -1 })
      .populate({ path: "companyId", select: "companyName" })
      .populate({ path: "userId", select: "name" });
    res.json(Passengers);

    // console.log("pasengers list", Passengers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error getting Passengers List" });
  }
};

const getOne = async (req, res) => {
  const passenger = await Passenger.findById(req.params.id);
  res.json(passenger);
};

// POST /Passengers
const create = async (req, res) => {
  try {
    const Passenger = await Passenger.create(req.body);
    res.json(Passenger);
  } catch (error) {
    res.status(500).json({ message: "Error creating Passenger" });
  }
};

// PUT /Passengers/:id
const update = async (req, res) => {
  try {
    const updated = await Passenger.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating Passenger" });
  }
};

// DELETE /Passengers/:id
const remove = async (req, res) => {
  try {
    await Passenger.findByIdAndDelete(req.params.id);
    res.json({ message: "Passenger deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Passenger" });
  }
};

const passengerAPI = {
  list,
  getOne,
  create,
  update,
  remove,
};
export default passengerAPI;
