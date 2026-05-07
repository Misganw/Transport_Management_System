import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
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

    trafficOfficerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "traficPolices",
      required: true,
    },
    subrouteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subrouts",
      required: true,
    },
    assignmentDate: {
      type: Date,
      required: false,
    },
    detail: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("traficAssignments", assignmentSchema);
