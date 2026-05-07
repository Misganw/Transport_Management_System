import mongoose from "mongoose";
const referenceSchema = new mongoose.Schema(
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

    currency: { type: String },
    timeZone: { type: String },
    visibility: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("systemReference", referenceSchema);
