import express from "express";
import Driver from "../models/driversModel.js";
import Car from "../models/carsModel.js";
import { upload } from "../driverPhoto.js";
import path from "path";
import fs from "fs";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bycrypt from "bcryptjs";

// GET /Drivers
const list = async (req, res) => {
  try {
    const search = req.query.search || "";
    const query = search
      ? {
          $or: [
            { fName: { $regex: search, $options: "i" } },
            { mName: { $regex: search, $options: "i" } },
            { lName: { $regex: search, $options: "i" } },
            { mobile: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { gender: { $regex: search, $options: "i" } },
            { RID: { $regex: search, $options: "i" } },
            { CDL: { $regex: search, $options: "i" } },
            ...(isNaN(search)
              ? [] // if not number, skip age
              : [{ age: Number(search) }]), // exact match
            { position: { $regex: search, $options: "i" } },
            { RID: { $regex: search, $options: "i" } },
          ],
        }
      : {};
    const Drivers = await Driver.find(query).sort({ createdAt: -1 }).populate({
      path: "carId",
      select: "model type level plateNumber",
    });
    // console.log("Drivers found:", Drivers);
    res.json(Drivers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error getting Drivers List" });
  }
};
// get record by ID
const getOne = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: "Error getting driver" });
  }
};

// POST /Drivers
const create = async (req, res) => {
  try {
    const user = req.user;

    const creatDriver = await Driver.create({
      ...req.body,
      companyId: user.companyID,
      userId: user.id,
      profileImage: req.file ? `/driverPhotos/${req.file.filename}` : null,
    });
    const password = "driver123";
    const roles = "driver";
    const hashedPassword = await bycrypt.hash(password, 6);
    const profileImage = req.file ? `/driverPhotos/${req.file.filename}` : "";

    const existingUser = await User.findOne({
      email: req.body.email,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists",
        field: "email",
      });
    }
    await User.create({
      companyId: user.companyID,
      userId: user.id,
      employeeId: creatDriver._id,
      firstName: req.body.fName,
      middleName: req.body.mName,
      lastName: req.body.lName,
      gender: req.body.gender,
      age: req.body.age,
      name: `${req.body.fName} ${req.body.mName} ${req.body.lName}`,
      email: req.body.email,
      password: hashedPassword,
      roles,
      status: "Active",
      profileImage: profileImage,
    });
    res.json(creatDriver);
  } catch (error) {
    console.log(error);
    // DUPLICATE KEY ERROR (MongoDB)
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];

      return res.status(409).json({
        message: `${field} already exists. Please use a different value.`,
        field,
      });
    }

    // VALIDATION ERROR (Mongoose)
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message,
      });
    }

    res.status(500).json({ message: "Error creating Driver" });
  }
};

// PUT /Employee/:id
const update = async (req, res) => {
  try {
    const updateDriver = await Driver.findById(req.params.id);
    if (!updateDriver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    // Build update object
    const updateData = { ...req.body };

    // NEVER allow empty array to overwrite profileImage
    if (Array.isArray(updateData.profileImage)) {
      delete updateData.profileImage;
    }
    // If new image uploaded
    if (req.file) {
      //  Delete old image from disk
      if (updateDriver.profileImage) {
        // const oldImagePath = path.join(__dirname, "..", employee.profileImage);
        const oldImagePath = path.join(
          process.cwd(),
          updateDriver.profileImage,
        );

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Save new image path in DB
      updateData.profileImage = `/driverPhotos/${req.file.filename}`;
    }

    const updated = await Driver.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });
    res.json(updated);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating Driver" });
  }
};
// DELETE /Drivers/:id
export const remove = async (req, res) => {
  try {
    await Driver.findByIdAndDelete(req.params.id);
    res.json({ message: "Driver deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Driver" });
  }
};
const listByCompany = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.companyID) {
      return res
        .status(401)
        .json({ message: "Not authorized. No company ID." });
    }
    // console.log("req.user:", req.user); // check if middleware works

    const drivers = await Driver.find({ companyId: user.companyID });
    res.json(drivers);
  } catch (error) {
    console.error(error); // <-- add this to see the exact error
    res.status(500).json({ message: "Error getting drivers" });
  }
};
export const getCarByCompany = async (req, res) => {
  try {
    const user = req.user;
    const cars = await Car.find({ companyId: user.companyID });
    res.json(cars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting cars" });
  }
};
const driverAPI = {
  create: Object.assign(create, {
    middlewares: [upload.single("profileImage")],
  }),

  update: Object.assign(update, {
    middlewares: [upload.single("profileImage")],
  }),
  list,
  getOne,
  // create,
  // update,
  remove,
  listByCompany,
};

export default driverAPI;
