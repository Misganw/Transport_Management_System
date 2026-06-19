import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
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
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cars",
      required: true,
    },

    fName: { type: String },
    mName: { type: String },
    lName: { type: String },
    age: { type: Number },
    gender: { type: String },
    RID: { type: String, unique: true },
    CDL: { type: String, unique: true },
    drivingExperience: { type: Number },

    country: { type: String },
    state: { type: String },
    zone: { type: String },
    wereda: { type: String },
    city: { type: String },
    email: { type: String },
    phone: { type: String },
    profileImage: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model("drivers", driverSchema);
