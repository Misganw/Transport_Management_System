import express from "express";

import {
  updateLocation,
  getTracking,
  stopTracking,
} from "../controllers/gpsTrackingAPI.js";

const trackingRouter = express.Router();
trackingRouter.post("/tracking", updateLocation);

trackingRouter.get("/tracking/:report_Id", getTracking);

trackingRouter.put("/stop/:report_Id", stopTracking);

export default trackingRouter;
