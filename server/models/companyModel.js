import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    email: { type: String, required: true },
    country: { type: String },
    phone: { type: String },
    companyLogo: { type: String }, // URL or base64
  },
  { timestamps: true }
);

export default mongoose.model("Companies", companySchema);
