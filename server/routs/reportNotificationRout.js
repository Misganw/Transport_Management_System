import express from "express";
// Import controller functions
// import {
//   listTicketByProgram,
//   cancelTicket,
//   payTicket,
// } from "../controllers/ticketAPI.js";
import {
  getUnreadNotifications,
  openNotification,
} from "../controllers/reportNotificationAPI.js";
import { getTicketById } from "../controllers/ticketAPI.js";
import getUserID, { requireRole } from "../middleware/middleware.js";

// Define routes and link to controller functions
const reportNotificationRouter = express.Router();

reportNotificationRouter.get(
  "/notifications/unread",
  getUserID,
  getUnreadNotifications,
);
reportNotificationRouter.put("/notifications/open/:id", openNotification);

export default reportNotificationRouter;
