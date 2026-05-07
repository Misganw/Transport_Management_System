import mongoose from "mongoose";
const weredaSchema = new mongoose.Schema(
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
    zoneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Zones",
      required: true,
    },

    weredaName: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Weredas", weredaSchema);
