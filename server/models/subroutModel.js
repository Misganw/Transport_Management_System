import mongoose from "mongoose";

const routeSchema = new mongoose.Schema(
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
    subdeparture: { type: String },
    subarrival: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model("subrouts", routeSchema);
