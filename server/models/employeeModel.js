import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
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
    position: { type: String },
    exprience: { type: Number },
    department: { type: String },

    country: { type: String },
    state: { type: String },
    zone: { type: String },
    wereda: { type: String },
    city: { type: String },
    email: { type: String },
    phone: { type: String },
    profileImage: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("employees", employeeSchema);
