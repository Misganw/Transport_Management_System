import mongoose from "mongoose";

const ruleSchema = new mongoose.Schema(
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

    title: { type: String, required: true },
    description: { type: String, required: false },
  },
  { timestamps: true },
);

export default mongoose.model("rules", ruleSchema);
