import mongoose from "mongoose";
const zoneSchema = new mongoose.Schema(
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
    stateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "States",
      required: true,
    },

    zoneName: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Zones", zoneSchema);
