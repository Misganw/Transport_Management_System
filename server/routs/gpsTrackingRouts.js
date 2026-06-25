import express from "express";

import {
  updateLocation,
  getTracking,
  stopTracking,
} from "../controllers/gpsTrackingAPI.js";
import getUserID from "../middleware/middleware.js";

const trackingRouter = express.Router();
trackingRouter.post("/tracking", getUserID, updateLocation);
trackingRouter.put("/tracking/:report_Id", getUserID, updateLocation);
trackingRouter.get("/tracking/:report_Id", getUserID, getTracking);

trackingRouter.put("/stop/:report_Id", stopTracking);

export default trackingRouter;
