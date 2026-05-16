import express from "express";
import TrafficPolice from "../models/traficPoliceModel.js";
import fs from "fs";
import path from "path";
import { get } from "http";

//  GET /Employees
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
            { age: { $regex: search, $options: "i" } },
            { position: { $regex: search, $options: "i" } },
            { RID: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const tfPolice = await TrafficPolice.find(query);
    res.json(tfPolice);
  } catch (error) {
    res.status(500).json({ message: "Error getting Traffic Police List" });
  }
};

// get record by ID
const getOne = async (req, res) => {
  const tfpolice = await TrafficPolice.findById(req.params.id);
  res.json(tfpolice);
};
// POST   /Employee
const create = async (req, res) => {
  try {
    const user = req.user;

    const tfPolice = await TrafficPolice.create({
      ...req.body,
      companyId: user.companyID,
      userId: user.id,
      profileImage: req.file ? `/empPhotos/${req.file.filename}` : null,
    });
    res.json(tfPolice);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating Traffic Police" });
  }
};

// PUT /Employee/:id
const update = async (req, res) => {
  try {
    // const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    // });
    const tfPolice = await TrafficPolice.findById(req.params.id);
    if (!tfPolice) {
      return res.status(404).json({ message: "Traffic Police not found" });
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
      if (tfPolice.profileImage) {
        // const oldImagePath = path.join(__dirname, "..", employee.profileImage);
        const oldImagePath = path.join(process.cwd(), tfPolice.profileImage);

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Save new image path in DB
      updateData.profileImage = `/empPhotos/${req.file.filename}`;
    }

    const updated = await TrafficPolice.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true },
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating Traffic Police" });
  }
};

// DELETE /Employee/:id
const remove = async (req, res) => {
  try {
    await TrafficPolice.findByIdAndDelete(req.params.id);
    res.json({ message: "Traffic Police deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Employee" });
  }
};
// GET /employees/by-company. This when creating Users Record
export const getTrafficPoliceBycompany = async (req, res) => {
  try {
    const user = req.user; // from auth middleware

    if (!user?.companyID) {
      return res.status(400).json({ message: "Company not found" });
    }

    const tfpolice = await TrafficPolice.find(
      { companyId: user.companyID },
      {
        fName: 1,
        mName: 1,
        lName: 1,
        email: 1,
        age: 1,
        gender: 1,
        profileImage: 1,
      }, // only what frontend needs
    );

    const result = tfpolice.map((e) => ({
      _id: e._id,
      email: e.email,
      age: e.age,
      gender: e.gender,
      profileImage: e.profileImage,
      name: [e.fName, e.mName, e.lName].filter(Boolean).join(" "),
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees" });
  }
};

// Step 2: Create a default export object
const trafficPoliceAPI = {
  list,
  getOne,
  create,
  update,
  remove,
};

export default trafficPoliceAPI;
