import mongoose, { Mongoose } from "mongoose";
const providerSchema = new mongoose.Schema({
  providerName: { type: String, required: true }, // google, facebook, github
  providerId: { type: String, required: true },
  name: { type: String },
  email: { type: String },
  profilePhoto: { type: String },
});

const userSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Companies",
      required: false,
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId, // Assuming you want to reference an Employee model
      ref: "Employees", // Reference to the Employees model
      unique: true, // Ensure each user has a unique employee ID
      required: false,
    },
    passengerId: {
      type: mongoose.Schema.Types.ObjectId, // Assuming you want to reference a Passenger model
      ref: "Passengers", // Reference to the Passengers model
      unique: true, // Ensure each user has a unique passenger ID
      required: false, // Unique identifier for passengers
    },
    firstName: { type: String },
    middleName: { type: String },
    lastName: { type: String },
    gender: { type: String, required: false },
    age: { type: Number },
    fydano: { type: String }, // or FydaNo if that’s your ID field
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: { type: String },
    statuses: { type: String },
    // New field for profile image
    profileImage: { type: String, default: "" },

    // Social login providers
    providers: [providerSchema],

    // Verification fields (keep as they are)
    verifyOTP: { type: String, default: "" },
    verifyOTPExpireAt: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    resetOTP: { type: String, default: "" },
    resetOTPExpireAt: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model("users", userSchema);
