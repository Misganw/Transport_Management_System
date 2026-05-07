import express from "express";
import Rule from "../models/rulesModel.js";
import Company from "../models/companyModel.js";

// GET /Rules
const list = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    const search = req.query.search || "";

    // Get all Programs that belong to the current user in this company
    const company = await Company.find({
      _id: user.companyID,
    }).select("_id");
    const companyIds = company.map((c) => c._id);

    // $regex used to make word pattern match, I used to avoid case sensesitivity.
    const filter = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const rules = await Rule.find({
      companyId: { $in: companyIds },
      // userId: user.id || user._id,
      ...filter,
    })
      .populate({ path: "companyId", select: "companyName" })
      .populate({ path: "userId", select: "name" });

    res.json(rules);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error getting Rules  List" });
  }
};

const getOne = async (req, res) => {
  try {
    const rule = await Rule.findById(req.params.id);
    res.json(rule);
  } catch (error) {
    res.status(500).json({ message: "Error getting rule." });
  }
};

// POST /Rules
const create = async (req, res) => {
  const user = req.user; // from auth middleware
  try {
    const rul = await Rule.create({
      ...req.body,
      userId: user.id,
      companyId: user.companyID,
    });
    res.json(rul);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating Rule" });
  }
};

// PUT /Rules/:id
const update = async (req, res) => {
  try {
    const updated = await Rule.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating Rule" });
  }
};

// DELETE /Rules/:id
const remove = async (req, res) => {
  try {
    await Rule.findByIdAndDelete(req.params.id);
    res.json({ message: "Rule deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Rule" });
  }
};

const ruleAPI = {
  list,
  getOne,
  create,
  update,
  remove,
};

export default ruleAPI;
