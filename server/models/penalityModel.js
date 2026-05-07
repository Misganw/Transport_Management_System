import e from "express";
import mongoose from "mongoose";
const penalitySchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Companies",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "routes",
      required: true,
    },
    programId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "programs",
      required: true,
    },
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cars",
      required: true,
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "drivers",
      required: true,
    },
    reportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "reports",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
export default mongoose.model("penalities", penalitySchema);
