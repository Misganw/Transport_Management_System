import express from "express";
import Owner from "../models/ownersModel.js";
import { upload } from "../ownerPhoto.js";
import path from "path";
import fs from "fs";

// GET /Owners
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
            ...(isNaN(search)
              ? [] // if not number, skip age
              : [{ age: Number(search) }]), // exact match
            { position: { $regex: search, $options: "i" } },
            { RID: { $regex: search, $options: "i" } },
          ],
        }
      : {};
    const Owners = await Owner.find(query);
    res.json(Owners);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error getting Owners List" });
  }
};
// get record by ID
const getOne = async (req, res) => {
  try {
    const owner = await ownersModel.findById(req.params.id);
    res.json(owner);
  } catch (error) {
    res.status(500).json({ message: "Error getting owner" });
  }
};

// POST /Owners
const create = async (req, res) => {
  try {
    const user = req.user;

    const creatOwner = await Owner.create({
      ...req.body,
      companyId: user.companyID,
      userId: user.id,
      profileImage: req.file ? `/ownerPhotos/${req.file.filename}` : null,
    });

    res.json(creatOwner);
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

    res.status(500).json({ message: "Error creating Ownere" });
  }
};

// PUT /Employee/:id
const update = async (req, res) => {
  try {
    // const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    // });
    const updateOwner = await Owner.findById(req.params.id);
    if (!updateOwner) {
      return res.status(404).json({ message: "Owner not found" });
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
      if (updateOwner.profileImage) {
        // const oldImagePath = path.join(__dirname, "..", employee.profileImage);
        const oldImagePath = path.join(process.cwd(), updateOwner.profileImage);

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Save new image path in DB
      updateData.profileImage = `/ownerPhotos/${req.file.filename}`;
    }

    const updated = await Owner.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });
    res.json(updated);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating Owner" });
  }
};
// DELETE /Owners/:id
export const remove = async (req, res) => {
  try {
    await Owner.findByIdAndDelete(req.params.id);
    res.json({ message: "Owner deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Owner" });
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

    const owners = await Owner.find({ companyId: user.companyID });
    res.json(owners);
  } catch (error) {
    console.error(error); // <-- add this to see the exact error
    res.status(500).json({ message: "Error getting owners" });
  }
};
const ownerAPI = {
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

export default ownerAPI;
