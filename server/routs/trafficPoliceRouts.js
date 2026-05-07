import express from "express";
// Import controller functions
import { getTrafficPolicesBycompany } from "../controllers/trafficPoliceAPI.js";

// Define routes and link to controller functions
const TrafficPoliceRouter = express.Router();

TrafficPoliceRouter.get("/", getTrafficPolicesBycompany);
export default TrafficPoliceRouter;
