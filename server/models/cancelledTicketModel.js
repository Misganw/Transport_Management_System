import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
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

    programId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "programs",
      required: true,
    },
    // passengerId: { type: String },
    seatNumber: { type: Number },
    passengerName: { type: String },
    email: { type: String },
    phone: { type: String },
    paymentStatus: {
      type: String,
      enum: ["reserved", "pending", "paid", "canceled"],
    },
    reservationCode: {
      type: String,
      unique: true,
      index: true,
    },
    canceledAt: { type: Date, default: Date.now },
    reason: {
      type: String,
    },
  },

  { timestamps: true },
);

export default mongoose.model("cancelledTickets", ticketSchema);
