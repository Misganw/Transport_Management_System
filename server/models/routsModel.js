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

    departure: { type: String },
    arrival: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("routs", routeSchema);
