import mongoose from "mongoose";
const citySchema = new mongoose.Schema(
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
    weredaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Weredas",
      required: true,
    },

    cityName: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Cities", citySchema);
