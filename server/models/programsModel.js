import mongoose from "mongoose";

const programSchema = new mongoose.Schema(
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
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "drivers",
      required: true,
    },
    paidSeatCount: { type: Number },
    queue: { type: String },
    tarrif: { type: Number },
    status: {
      type: String,
      enum: [
        "scheduled",
        "full",
        "come inside",
        "active",
        "canceled",
        "Date Passed",
      ],
      default: "scheduled",
    },
    date: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.model("programs", programSchema);
