import mongoose from "mongoose";

const officerSchema = new mongoose.Schema(
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

    fName: { type: String },
    mName: { type: String },
    lName: { type: String },
    age: { type: String },
    gender: { type: String },
    RID: { type: String, unique: true },
    rank: { type: String },
    exprience: { type: Number },

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

export default mongoose.model("traficPolices", officerSchema);
