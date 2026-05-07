import express from "express";
import Company from "../models/companyModel.js";
import { seedDefaultRecords } from "./defaultSeed/seedDefaultRecords.js";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";
import systemReference from "../models/systemReference/systemReferenceModel.js";

// ..... Create new company .......
export const createCompany = async (req, res) => {
  try {
    const { companyName, email, country, phone } = req.body;

    const profileImage = req.file ? `/companyLogos/${req.file.filename}` : "";

    const existingUser = await Company.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Company already exists",
      });
    }

    const company = await Company.create({
      companyName,
      email,
      country,
      phone,
      companyLogo: profileImage,
    });

    await seedDefaultRecords(company._id, email);

    // ✅ SEND ONLY ONE RESPONSE
    res.status(201).json({
      success: true,
      message:
        "Company created successfully! Check your email for login credentials.",
      company,
    });

    // ----------------------------------------------------
    // SEND EMAIL IN BACKGROUND (NO await, NO response)
    // ----------------------------------------------------
    const mailOption = {
      from: process.env.senderEmail,
      to: email,
      subject: "Welcome to Traffic Management System",
      text: `Your Company is created successfully. Login using Email: ${email} and Password: admin123`,
    };

    transporter
      .sendMail(mailOption)
      .catch((err) => console.log("EMAIL ERROR:", err));
  } catch (err) {
    console.log("CREATE COMPANY ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};

// ..... Get all companies .......
export const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find(); // Fetch all companies
    res.status(200).json(companies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// .... get company info by id ......
export const getComById = async (req, res) => {
  try {
    const user = req.user;
    const companies = await Company.findOne({ _id: user.companyID }); // Fetch all companies
    // console.log("CompanyID" + user.companyID);
    if (!companies) {
      return res
        .status(200)
        .json({ success: false, message: "Company not found." });
    }
    res.status(200).json({ success: true, companies });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
// ..... Update company info .......
export const updateCompany = async (req, res) => {
  try {
    const updateData = {
      companyName: req.body.companyName,
      email: req.body.email,
      country: req.body.country,
      phone: req.body.phone,
    };

    if (req.file) updateData.profileImage = req.file.filename;

    const updated = await Company.findByIdAndUpdate(
      req.user.companyID,
      updateData,
      { new: true }
    );

    res.json({ success: true, message: "Company updated", company: updated });
  } catch (err) {
    // console.log("UPDATE ERROR:", err); // << SEE REAL ERROR
    res.status(500).json({ success: false, message: err.message });
  }
};

// ..... get company preference data .......
export const getPreference = async (req, res) => {
  try {
    const pref = await systemReference.findOne({
      companyId: req.user.companyID,
    });

    if (!pref) {
      return res.json({ success: true, preference: null });
    }

    res.json({ success: true, preference: pref });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ..... Update company preference data .......
export const updatePreference = async (req, res) => {
  const user = req.user;
  try {
    const updated = await systemReference.findByIdAndUpdate(
      user.companyID,
      {
        companyId: user.companyID,
        userId: user.id,
        currency: req.body.currency,
        timeZone: req.body.timeZone,
        visibility: req.body.visibility,
      },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: "Preferences updated",
      company: updated,
    });
  } catch (err) {
    console.log("UPDATE PREFERENCE ERROR:", err); // << SEE REAL ERROR
    res.status(500).json({ success: false, message: "Update failed" });
  }
};
