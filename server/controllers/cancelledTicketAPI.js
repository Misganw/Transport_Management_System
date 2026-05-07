import express from "express";
import mongoose from "mongoose";
import Ticket from "../models/ticketsModel.js";
import CanceledTicket from "../models/cancelledTicketModel.js";
import Program from "../models/programsModel.js";
import CancelledTicket from "../models/cancelledTicketModel.js";
import Company from "../models/companyModel.js";
import Stripe from "stripe";

// GET /Tickets
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
            { passengerName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { reservationCode: { $regex: search, $options: "i" } },
            { paymentStatus: { $regex: search, $options: "i" } },
            { ...(isNaN(search) ? [] : [{ seatNumber: parseInt(search) }]) },
          ],
        }
      : {};

    const Tickets = await CanceledTicket.find({
      companyId: { $in: companyIds },
      userId: user.id || user._id,
      ...filter,
    })
      .populate({ path: "companyId", select: "companyName" })
      .populate({ path: "userId", select: "name" })
      .populate({
        path: "programId",
        select: "tarrif queue",
        populate: [
          { path: "carId", select: "type level" },
          { path: "routId", select: "departure arrival" },
        ],
      });

    res.json(Tickets);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error getting Tickets List" });
  }
};

const getOne = async (req, res) => {
  try {
    const ticket = await CanceledTicket.findById(req.params.id);
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Error getting ticket." });
  }
};

// PUT /Tickets/:id
const update = async (req, res) => {
  try {
    const updated = await CanceledTicket.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      },
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating Ticket" });
  }
};

// DELETE /Tickets/:id
const remove = async (req, res) => {
  try {
    await CanceledTicket.findByIdAndDelete(req.params.id);
    res.json({ message: "Ticket deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Ticket" });
  }
};

const cancelledTicketAPI = {
  list,
  getOne,
  update,
  remove,
};
export default cancelledTicketAPI;
