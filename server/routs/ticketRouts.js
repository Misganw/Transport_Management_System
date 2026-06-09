import express from "express";
// Import controller functions
import {
  listTicketByProgram,
  cancelTicket,
  payTicket,
} from "../controllers/ticketAPI.js";
import { payment_success } from "../success/payment_success.js";
import stripeWebhook from "../webhooks/stripeWebhook.js";
import chapaWebhook from "../webhooks/chapaWebhook.js";
import { getTicketById } from "../controllers/ticketAPI.js";
import getUserID, { requireRole } from "../middleware/middleware.js";

// Define routes and link to controller functions
const TicketRouter = express.Router();

TicketRouter.get(
  "/getTicketByProgram/:programId",
  getUserID,
  listTicketByProgram,
);
TicketRouter.post("/payTicket", payTicket);
TicketRouter.delete(
  "/cancelTicket/:ticketId",
  getUserID,
  requireRole("cancel ticket", "admin", "manager", "passenger"),
  cancelTicket,
);
// TicketRouter.put("/confirm_payment/:ticketId", payment_success);
TicketRouter.post("/stripe-webhook", stripeWebhook);
TicketRouter.post(
  "/chapa-webhook",
  chapaWebhook,
); /* Reusing Stripe webhook for Chapa for now */
TicketRouter.get("/getPymentInfo/:ticketId", getTicketById);
export default TicketRouter;
