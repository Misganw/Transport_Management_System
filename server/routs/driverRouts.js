import express from "express";
// Import controller functions
import {
  getDrivers,
  createDriver,
  getDriverByID,
  deleteDriverByID,
} from "../controllers/driverAPI.js";

export default DriverRouter;
