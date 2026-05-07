import mongoose from "mongoose";
const tarrifSchema = new mongoose.Schema(
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
    routId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "routs",
      required: true,
    },
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cars",
      required: true,
    },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("tarrifs", tarrifSchema);
