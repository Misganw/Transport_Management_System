import express from "express";
// Import controller functions
import { getCarByCompany } from "../controllers/driverAPI.js";
import getUserID from "../middleware/middleware.js";
const DriverRouter = express.Router();

// Define routes
DriverRouter.get("/getCarByCompany", getUserID, getCarByCompany);
// Other routes for drivers can be defined here (e.g., create, update, delete, list, etc.)

export default DriverRouter;
