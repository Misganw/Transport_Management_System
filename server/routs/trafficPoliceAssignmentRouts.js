import express from "express";
// Import controller functions
import { subRoutByRout, officer } from "../controllers/trafficAssignmentAPI.js";
import getUserID, { requireRole } from "../middleware/middleware.js";

// Define routes and link to controller functions
const TrafficAssignmentRouter = express.Router();

TrafficAssignmentRouter.get("/subroutes", getUserID, subRoutByRout);
TrafficAssignmentRouter.get("/officers", getUserID, officer);
export default TrafficAssignmentRouter;
