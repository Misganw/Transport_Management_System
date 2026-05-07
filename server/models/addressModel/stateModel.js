import mongoose from "mongoose";
const stateSchema = new mongoose.Schema(
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
    countryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Countries",
      required: true,
    },

    stateName: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("States", stateSchema);
