import express from "express";
import State from "../models/addressModel/stateModel.js";
import Company from "../models/companyModel.js";
import Subrout from "../models/subroutModel.js";
import Police from "../models/traficAssignmentModel.js";
import Report from "../models/reportsModel.js";
import officer from "../models/traficPoliceModel.js";
import User from "../models/userModel.js";
import Notification from "../models/reportNotificationModel.js";
import { populate } from "dotenv";
import { get } from "mongoose";

export const getUnreadNotifications = async (req, res) => {
  try {
    const user = req.user;

    const getUser = await User.findById(user.id);

    const notifications = await Notification.find({
      officerId: getUser.employeeId,
      isRead: false,
    })
      .populate("reportId")
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const openNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    notification.isRead = true;

    await notification.save();

    await Report.findByIdAndUpdate(notification.reportId, {
      Status: "opened",
    });

    res.json({
      success: true,
      reportId: notification.reportId,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
