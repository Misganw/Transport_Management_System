import express from "express";
// Import controller functions
import {
  listPenalityByReport,
  payPenality,
  cancelPenality,
  getPenalityById,
} from "../controllers/penalityAPI.js";
import { payment_success } from "../success/payment_success.js";
import stripeWebhook from "../webhooks/stripeWebhook.js";
import chapaWebhook from "../webhooks/chapaWebhook.js";

import getUserID, { requireRole } from "../middleware/middleware.js";

// Define routes and link to controller functions
const PenalityRouter = express.Router();

PenalityRouter.get(
  "/getPenalityByReport/:reportId",
  getUserID,
  listPenalityByReport,
);
PenalityRouter.post("/payPenality", payPenality);
PenalityRouter.delete(
  "/cancelPenality/:penalityId",
  getUserID,
  requireRole("cancel penality", "admin", "manager", "officer"),
  cancelPenality,
);
PenalityRouter.put("/confirm_payment/:penalityId", payment_success);
PenalityRouter.post("/stripe-webhook", stripeWebhook);
// PenalityRouter.post("/webhook/chapa", chapaWebhook);
PenalityRouter.get("/getPaymentInfo/:penalityId", getPenalityById);
export default PenalityRouter;
