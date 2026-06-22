import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
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
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tickets",
      required: true,
    },
    ruleID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "rules",
      required: true,
    },
    officerAssignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "traficAssignments",
      required: true,
    },

    CaseDescription: { type: String },
    Status: {
      type: String,
      enum: ["claimed", "opened", "punished", "completed"],
      default: "claimed",
    },
    location: {
      latitude: Number,
      longitude: Number,
      accuracy: Number,
    },
  },
  { timestamps: true },
);

export default mongoose.model("reports", reportSchema);
