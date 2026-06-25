import mongoose from "mongoose";

const liveTrackingSchema = new mongoose.Schema(
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "companies" },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    report_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "reports",
      required: true,
    },

    latitude: Number,

    longitude: Number,

    accuracy: Number,

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("liveTrackings", liveTrackingSchema);
