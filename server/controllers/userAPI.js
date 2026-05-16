import express from "express";
import Employee from "../models/employeeModel.js";
import Traffice from "../models/traficPoliceModel.js";
import Users from "../models/userModel.js";
import Company from "../models/companyModel.js";
import bcrypt from "bcryptjs";

// GET /cars
const list = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    const search = req.query.search || "";

    // Get all owners that belong to the current user in this company
    const byCurrentUser = await Company.find({
      _id: user.companyID,
    }).select("_id");

    const companyIds = byCurrentUser.map((usr) => usr._id);
    // console.log(companyIds);

    // $regex used to make word pattern match, I used to avoid case sensesitivity.
    const filter = search
      ? {
          // $or is a MongoDB logical operator that Match the document if ANY of these conditions is true."
          $or: [
            { name: { $regex: search, $options: "i" } },
            { roles: { $regex: search, $options: "i" } },
            { statuses: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const users = await Users.find({
      companyId: { $in: companyIds },
      ...filter,
    }).populate("companyId", "companyName");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error getting User List" });
  }
};

// get record by ID
const getOne = async (req, res) => {
  try {
    const user = await Users.findById(req.params.id).populate(
      "companyId",
      "companyName",
    ); // fetch only companyName
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error geting Users" });
  }
};

const create = async (req, res) => {
  try {
    const user = req.user; // from auth middleware

    if (!user || !user.companyID) {
      return res
        .status(400)
        .json({ message: "Authenticated user missing companyId" });
    }

    const { password, employeeId, roles, ...rest } = req.body;

    const existingUser = await Users.findOne({
      $or: [{ employeeId: employeeId }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists for this employee",
      });
    }

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 6);

    let sourceData = "";
    if (roles.includes("officer")) {
      // Find selected traffic police
      const traffic = await Traffice.findById(employeeId);
      if (!traffic) {
        return res.status(404).json({ message: "Traffic Police not found" });
      }
      sourceData = traffic;
    } else if (
      roles.includes("manager") ||
      roles.includes("admin") ||
      roles.includes("coordinator")
    ) {
      // 1️⃣ Find selected employee
      const employee = await Employee.findById(employeeId);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      sourceData = employee;
    } else {
      return res.status(400).json({ message: "Invalid role for user" });
    }

    // 3️⃣ Build payload
    const payload = {
      ...rest,
      password: hashedPassword,
      companyId: user.companyID,
      userId: user.id || user._id,

      employeeId: sourceData._id,

      firstName: sourceData.fName,
      middleName: sourceData.mName,
      lastName: sourceData.lName,
      name: [sourceData.fName, sourceData.mName, sourceData.lName]
        .filter(Boolean)
        .join(" "),
      age: sourceData.age,
      gender: sourceData.gender,
      profileImage: sourceData.profileImage,
      // email: sourceData.email,
    };
    // console.log("Payload for new user:", employeeId, payload);

    // 4️⃣ Create user
    const usr = await Users.create(payload);

    // 5️⃣ Remove password before sending response
    const userResponse = usr.toObject();
    delete userResponse.password;

    res.json(userResponse);

    console.log("sourceData:", sourceData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating Users" });
  }
};

const update = async (req, res) => {
  try {
    const { password, ...rest } = req.body;

    const updateData = { ...rest };

    // Hash ONLY if user entered a new password
    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 6);
    }

    const updated = await Users.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
      select: "-password", // never return password
    });

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};

// DELETE /users/:id
const remove = async (req, res) => {
  try {
    await Users.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting User" });
  }
};

// Step 2: Create a default export object
const userAPI = {
  list,
  getOne,
  create,
  update,
  remove,
};

export default userAPI;
