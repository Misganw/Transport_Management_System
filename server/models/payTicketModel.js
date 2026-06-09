import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Companies",
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },

    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tickets",
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "usd",
    },

    paymentDate: {
      type: Date,
      default: Date.now,
    },

    paymentMethod: {
      type: String,
      default: "stripe",
    },

    referenceNumber: {
      type: String, // Stripe Payment Intent ID
    },

    customerName: {
      type: String,
    },

    customerEmail: {
      type: String,
    },

    customerPhone: {
      type: String,
    },

    status: {
      type: String,
      default: "paid",
    },

    rawResponse: {
      type: Object,
    },
  },
  { timestamps: true },
);

export default mongoose.model("ticketPayments", paymentSchema);
