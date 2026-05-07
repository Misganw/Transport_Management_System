import mongoose from "mongoose";
const carSchema = new mongoose.Schema(
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
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "carOwners",
      required: true,
    },

    type: { type: String },
    model: { type: String },
    plateNumber: { type: String },
    level: { type: String },
    value: { type: Number },
    NoofSeats: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("cars", carSchema);
