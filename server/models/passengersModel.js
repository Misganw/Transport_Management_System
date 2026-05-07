import mongoose from "mongoose";

const passengerSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Companies",
      required: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    fName: { type: String },
    mName: { type: String },
    lName: { type: String },
    age: { type: Number },
    gender: { type: String },
    RID: { type: String, unique: true },

    country: { type: String },
    state: { type: String },
    zone: { type: String },
    wereda: { type: String },
    city: { type: String },
    email: { type: String },
    phone: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model("passengers", passengerSchema);
