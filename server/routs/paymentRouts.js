import express from "express";
// Import controller functions
import {
  getPayments,
  createPayment,
  getPaymentByID,
  deletePaymentByID,
} from "../controllers/paymentAPI.js";

// Define routes and link to controller functions
const PaymentRouter = express.Router();

PaymentRouter.get("/", getPayments);
// POST /Payments
PaymentRouter.post("/", createPayment);
// PUT /Payments/:id
PaymentRouter.put("/:id", getPaymentByID);
// DELETE /Payments/:id
PaymentRouter.delete("/:id", deletePaymentByID);
export default PaymentRouter;
