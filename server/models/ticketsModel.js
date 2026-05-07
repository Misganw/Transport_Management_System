import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Companies",
      required: true,
    },
    passengerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "passengers",
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
      default: "reserved",
    },
    reservationCode: {
      type: String,
      unique: true,
      index: true,
    },

    // purchaseDate: { type: Date, default: Date.now },
    paidAt: { type: Date, default: Date.now },
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
  },
  { timestamps: true },
);

export default mongoose.model("tickets", ticketSchema);
