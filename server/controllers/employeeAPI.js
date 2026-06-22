import express from "express";
import Employee from "../models/employeeModel.js";
import fs from "fs";
import path from "path";

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

    const Employees = await Employee.find(query).sort({ createdAt: -1 });
    res.json(Employees);
  } catch (error) {
    res.status(500).json({ message: "Error getting Employee List" });
  }
};

// get record by ID
const getOne = async (req, res) => {
  const employee = await employeeModel.findById(req.params.id);
  res.json(employee);
};
// POST   /Employee
const create = async (req, res) => {
  try {
    const user = req.user;

    const employee = await Employee.create({
      ...req.body,
      companyId: user.companyID,
      userId: user.id,
      profileImage: req.file ? `/empPhotos/${req.file.filename}` : null,
    });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: "Error creating Employee" });
  }
};

// PUT /Employee/:id
const update = async (req, res) => {
  try {
    // const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    // });
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
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
      if (employee.profileImage) {
        // const oldImagePath = path.join(__dirname, "..", employee.profileImage);
        const oldImagePath = path.join(process.cwd(), employee.profileImage);

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Save new image path in DB
      updateData.profileImage = `/empPhotos/${req.file.filename}`;
    }

    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true },
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating Employee" });
  }
};

// DELETE /Employee/:id
const remove = async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Employee" });
  }
};
// GET /employees/by-company. This when creating Users Record
const getEmployeesByCompany = async (req, res) => {
  try {
    const user = req.user; // from auth middleware

    if (!user?.companyID) {
      return res.status(400).json({ message: "Company not found" });
    }

    const employees = await Employee.find(
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

    const result = employees.map((e) => ({
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
const employeeAPI = {
  list,
  getOne,
  create,
  update,
  remove,
  getEmployeesByCompany,
};

export default employeeAPI;
