import express from "express";
// Import controller functions
import {
  getTicketId,
  getAssignedPoliceByTicket,
} from "../controllers/reportAPI.js";
import getUserID from "../middleware/middleware.js";

// Define routes and link to controller functions
const ReportRouter = express.Router();

ReportRouter.get("/", getUserID, getTicketId);
ReportRouter.get("/:ticketId", getUserID, getAssignedPoliceByTicket);
ReportRouter.get(
  "/assigned-police/:ticketId",
  getUserID,
  getAssignedPoliceByTicket,
);
export default ReportRouter;
