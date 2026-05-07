import express from "express";
import Penality from "../models/penalityModel.js";

// GET /Penalities
const list = async (req, res) => {
  try {
    const search = req.query.search || "";
    const Penalities = await Penality.find({
      model: { $regex: search, $options: "i" },
    });
    res.json(Penalities);
  } catch (error) {
    res.status(500).json({ message: "Error getting Penalities List" });
  }
};

const getOne = async (req, res) => {
  try {
    const penality = await Penality.findById(req.params.id);
    res.json({ penality });
  } catch (error) {
    res.status(500).json({ message: "Error getting Penality" });
  }
};

// POST /Penalities
const create = async (req, res) => {
  try {
    const Penalitie = await Penality.create(req.body);
    res.json(Penalitie);
  } catch (error) {
    res.status(500).json({ message: "Error creating Penalitie" });
  }
};

// PUT /Penalities/:id
const update = async (req, res) => {
  try {
    const updated = await Penality.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating Penalitie" });
  }
};

// DELETE /Penalities/:id
const remove = async (req, res) => {
  try {
    await Penalitie.findByIdAndDelete(req.params.id);
    res.json({ message: "Penalitie deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Penalitie" });
  }
};

const penalityAPI = {
  list,
  getOne,
  create,
  update,
  remove,
};

export default penalityAPI;
