import express from "express";
import Country from "../models/addressModel/countryModel.js";
import State from "../models/addressModel/stateModel.js";
import Company from "../models/companyModel.js";
import Rout from "../models/routsModel.js";
import Subrout from "../models/subroutModel.js";
import Police from "../models/traficAssignmentModel.js";
import Report from "../models/reportsModel.js";
import Ticket from "../models/ticketsModel.js";
import Program from "../models/programsModel.js";
import { populate } from "dotenv";
import { get } from "mongoose";

// GET /Report
const list = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    const search = req.query.search || "";

    // $regex used to make word pattern match, I used to avoid case sensesitivity.
    const filter = search
      ? {
          // $or is a MongoDB logical operator that Match the document if ANY of these conditions is true."
          $or: [
            { CaseDescription: { $regex: search, $options: "i" } },
            { status: { $regex: search, $options: "i" } },
          ],
        }
      : {};
    // Base query
    let qry = {
      companyId: { $in: user.companyID }, // Assuming user can belong to multiple companies
    };
    // Restrict if user is passenger
    if (user.roles === "passenger") {
      qry.userId = user.id;
      // assuming Passenger.userId references the logged-in user
    }
    const rpt = await Report.find({
      ...filter,
      ...qry,
    })
      .populate("companyId", "companyName")
      .populate("userId", "name roles")
      .populate("ruleID", "title")
      .populate({
        path: "ticketId",
        populate: [
          { path: "passengerId", select: "fName mName lName phone userId" },
          {
            path: "programId",
            populate: [
              { path: "routId", select: "departure arrival" },
              { path: "carId", select: "type model level plateNumber" },
            ],
          },
        ],
      })
      .populate({
        path: "officerAssignmentId",
        populate: [
          {
            path: "trafficOfficerId",
            select: "fName mName phone",
          },
          {
            path: "subrouteId",
            select: "subdeparture subarrival",
          },
        ],
      });
    console.log("Role", rpt[0]?.userId?.roles);
    res.json(rpt);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error getting Report List" });
  }
};

// get record by ID
const getOne = async (req, res) => {
  try {
    const state = await Report.findById(req.params.id).populate("_id", "title"); // fetch only Title
    res.json(state);
  } catch (error) {
    res.status(500).json({ message: "Error geting Report" });
  }
};
// POST /Report
const create = async (req, res) => {
  try {
    const user = req.user; // from auth middleware

    if (!user || !user.companyID) {
      return res
        .status(400)
        .json({ message: "Authenticated user missing companyId" });
    }
    const { ticketId } = req.body;

    // 1. Check if ticket exists
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // 2. Check payment status
    if (ticket.paymentStatus !== "paid") {
      return res.status(400).json({
        message: "Report cannot be created. Ticket is not paid.",
      });
    }

    const payload = {
      ...req.body,
      companyId: user.companyID,
      userId: user.id || user._id,
    };
    const stt = await Report.create(payload);
    res.json(stt);
  } catch (error) {
    console.error("Error creating Report:", error);
    res.status(500).json({ message: "Error creating Report" });
  }
};

// PUT /Report/:id
const update = async (req, res) => {
  try {
    const updated = await Report.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating Report" });
  }
};

// DELETE /Report/:id
const remove = async (req, res) => {
  try {
    await Report.findByIdAndDelete(req.params.id);
    res.json({ message: "Report deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Report" });
  }
};

export const getTicketId = async (req, res) => {
  try {
    const user = req.user;

    const tickets = await Ticket.find({
      companyId: user.companyID,
      userId: user.id,
    }).populate({
      path: "programId",
      populate: [
        { path: "routId", select: "departure arrival" },
        { path: "carId", select: "type level" },
      ],
    });
    if (tickets.length === 0) {
      return res
        .status(404)
        .json({
          message:
            "Tickets not found. Either not reserved or unpaid (Expired).",
        });
    }

    res.json(tickets);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error getting Ticket by Company and Logged in User",
    });
  }
};

export const getAssignedPoliceByTicket = async (req, res) => {
  const user = req.user;
  try {
    const { ticketId } = req.params;

    const getTicket = await Ticket.findById(ticketId);
    if (!getTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    // Security check
    if (getTicket.userId.toString() !== user.id) {
      return res.status(403).json({ message: "Unauthorized ticket access" });
    }

    const getProgram = await Program.findById(getTicket.programId);

    const Rt = await Rout.findById(getProgram.routId);

    const rtId = Rt._id;

    const subrout = await Subrout.find({
      routId: rtId,
    }).select("_id");

    const assinedPolice = await Police.find({
      subrouteId: { $in: subrout.map((s) => s._id) },
    })
      .populate("subrouteId", "subdeparture subarrival")
      .populate("trafficOfficerId", "fName mName lName phone");
    res.json(assinedPolice);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error getting Assigned Traffic police by Subrout" });
  }
};

// Step 2: Create a default export object
const routAPI = {
  list,
  getOne,
  create,
  update,
  remove,
};

export default routAPI;
