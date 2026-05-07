import express from "express";
import Car from "../models/carsModel.js";
import Owner from "../models/ownersModel.js";

// GET /cars
const list = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    const search = req.query.search || "";

    // Get all owners that belong to the current user in this company
    const owners = await Owner.find({
      companyId: user.companyID,
      userId: user.id, // only owners created by this user
    }).select("_id");

    const ownerIds = owners.map((o) => o._id);

    // $regex used to make word pattern match, I used to avoid case sensesitivity.
    const filter = search
      ? {
          // $or is a MongoDB logical operator that Match the document if ANY of these conditions is true."
          $or: [
            { model: { $regex: search, $options: "i" } },
            { type: { $regex: search, $options: "i" } },
            { level: { $regex: search, $options: "i" } },
            { plateNumber: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const cars = await Car.find({
      companyId: user.companyID,
      ownerId: { $in: ownerIds },
      ...filter,
    })
      .populate("companyId", "companyName")
      .populate("ownerId", "fName lName");
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: "Error getting Cars List" });
  }
};

// get record by ID
const getOne = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id)
      .populate("companyId", "companyName") // fetch only companyName
      .populate("ownerId", "fName lName"); // fetch only fullName;;
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: "Error geting cars" });
  }
};
// POST /cars
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
    const car = await Car.create(payload);
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: "Error creating Car" });
  }
};

// PUT /cars/:id
const update = async (req, res) => {
  try {
    const updated = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating Car" });
  }
};

// DELETE /cars/:id
const remove = async (req, res) => {
  try {
    await Car.findByIdAndDelete(req.params.id);
    res.json({ message: "Car deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Car" });
  }
};

// Step 2: Create a default export object
const carAPI = {
  list,
  getOne,
  create,
  update,
  remove,
};

export default carAPI;
