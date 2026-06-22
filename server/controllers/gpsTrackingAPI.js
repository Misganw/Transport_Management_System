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
import officer from "../models/traficPoliceModel.js";
import User from "../models/userModel.js";
import Notification from "../models/reportNotificationModel.js";
import { populate } from "dotenv";
import { get } from "mongoose";
import LiveTracking from "../models/LiveTruckingModel.js";

// POST
export const updateLocation = async (req, res) => {
  try {
    const user = req.user; // from auth middleware

    if (!user || !user.companyID) {
      return res
        .status(400)
        .json({ message: "Authenticated user missing companyId" });
    }
    const { report_Id, latitude, longitude, accuracy } = req.body;
    const payload = {
      ...req.body,
      companyId: user.companyID,
      userId: user.id || user._id,
    };
    const tracking = await LiveTracking.findOneAndUpdate(
      {
        report_Id,
        isActive: true,
      },
      {
        latitude,
        longitude,
        accuracy,
        userId: user.id,
      },
      {
        new: true,
        upsert: true,
      },
    );
    const io = req.app.get("io");
    io.to(req.body.report_Id).emit("vehicleLocation", tracking);

    res.json(tracking);
  } catch (error) {
    console.log("Error creating GPS data:", error);
    res.status(500).json({ message: "Error creating GPS data" });
  }
};

export const getTracking = async (req, res) => {
  console.log("URL:", req.originalUrl);
  console.log("PARAMS:", req.params);
  try {
    const tracking = await LiveTracking.findOne({
      report_Id: req.params.report_Id,
      isActive: true,
    });

    res.json(tracking);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: "Error getting tracking",
    });
  }
};

export const stopTracking = async (req, res) => {
  try {
    await LiveTracking.findOneAndUpdate(
      {
        report_Id: req.params.report_Id,
      },
      {
        isActive: false,
      },
    );

    io.to(req.params.report_Id).emit("trackingStopped");

    res.json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error stopping tracking",
    });
  }
};
