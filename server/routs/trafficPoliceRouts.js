import express from "express";
// Import controller functions
import { getTrafficPoliceBycompany } from "../controllers/trafficPoliceAPI.js";

// Define routes and link to controller functions
const TrafficPoliceRouter = express.Router();

TrafficPoliceRouter.get("/", getTrafficPoliceBycompany);
export default TrafficPoliceRouter;
