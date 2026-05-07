import mongoose from "mongoose";
const countrySchema = new mongoose.Schema(
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

    cName: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Countries", countrySchema);
