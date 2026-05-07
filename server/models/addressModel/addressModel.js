import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Companies",
      required: true,
    },
    userID: {
      type: String,
      required: true,
      unique: true,
    },
    country: { type: String },
    region: { type: String },
    zone: { type: String },
    werda: { type: String, required: false },
    city: { type: String },
  },
  { timestamps: true }
);
const addressModel =
  mongoose.models.users || mongoose.model("addresses", addressrSchema);
export default userModel;
