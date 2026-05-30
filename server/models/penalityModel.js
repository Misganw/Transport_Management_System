import e from "express";
import mongoose from "mongoose";
const penalitySchema = new mongoose.Schema(
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
    // routeId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "routes",
    //   required: true,
    // },
    // programId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "programs",
    //   required: true,
    // },
    // carId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "cars",
    //   required: true,
    // },
    driverId: {
      type: String,
      required: true,
    },
    reportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "reports",
      required: true,
    },
    paymentCode: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["opened", "pending", "paid", "canceled"],
      default: "opened",
    },
    payments: [
      {
        provider: { type: String, required: true }, // 'stripe', 'paypal', 'flutterwave', etc.
        providerPaymentId: String, // Stripe: session ID, PayPal: order ID
        paymentIntent: String, // Stripe: payment_intent, PayPal: optional
        amount: Number, // Paid amount
        currency: String,
        customer_name: String,
        customer_email: String,
        paidAt: { type: Date, default: Date.now },
        raw: mongoose.Schema.Types.Mixed, // store provider-specific raw data if needed
      },
    ],
    paymentMethod: {
      type: String,
      enum: [
        "cash",
        "telebirr",
        "mobileBanking",
        "chapa",
        "arifpay",
        "bankTransfer",
        "paypal",
        "zelle",
        "stripe",
      ],
    },
    paidAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);
export default mongoose.model("penalities", penalitySchema);
