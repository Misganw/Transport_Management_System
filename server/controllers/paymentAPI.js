import express from "express";
import Payment from "../models/paymentsModel.js";

// GET /Payments
const list = async (req, res) => {
  try {
    const search = req.query.search || "";
    const Payments = await Payment.find({
      model: { $regex: search, $options: "i" },
    });
    res.json(Payments);
  } catch (error) {
    res.status(500).json({ message: "Error getting Payments List" });
  }
};

const getOne = async (req, res) => {
  try {
    const getByID = await Payment.findById(req.params.id);
    res.json(getByID);
  } catch (error) {
    res.status(500).json({ message: "Error geting payment ID" });
  }
};
// POST /Payments
const create = async (req, res) => {
  try {
    const Payment = await Payment.create(req.body);
    res.json(Payment);
  } catch (error) {
    res.status(500).json({ message: "Error creating Payment" });
  }
};

// PUT /Payments/:id
const update = async (req, res) => {
  try {
    const updated = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating Payment" });
  }
};

// DELETE /Payments/:id
const remove = async (req, res) => {
  try {
    await Payment.findByIdAndDelete(req.params.id);
    res.json({ message: "Payment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Payment" });
  }
};

const paymentAPI = {
  list,
  getOne,
  create,
  update,
  remove,
};
export default paymentAPI;
