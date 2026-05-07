import express from "express";
import Driver from "../models/driversModel.js";

// GET /Drivers
const list = async (req, res) => {
  try {
    const search = req.query.search || "";
    const Drivers = await Driver.find({
      model: { $regex: search, $options: "i" },
    });
    res.json(Drivers);
  } catch (error) {
    res.status(500).json({ message: "Error getting Drivers List" });
  }
};
// get record by ID
const getOne = async (req, res) => {
  const driver = await driversModel.findById(req.params.id);
  res.json(driver);
};

// POST /Drivers
const create = async (req, res) => {
  try {
    const Driver = await Driver.create(req.body);
    res.json(Driver);
  } catch (error) {
    res.status(500).json({ message: "Error creating Driver" });
  }
};

// PUT /Drivers/:id
const update = async (req, res) => {
  try {
    const updated = await Driver.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating Driver" });
  }
};

// DELETE /Drivers/:id
const remove = async (req, res) => {
  try {
    await Driver.findByIdAndDelete(req.params.id);
    res.json({ message: "Driver deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Driver" });
  }
};
// Step 2: Create a default export object
const driverAPI = {
  list,
  getOne,
  create,
  update,
  remove,
};

export default driverAPI;
