import express from "express";
// Import controller functions
import {
  getPassengers,
  createPassenger,
  getPassengerByID,
  deletePassengerByID,
} from "../controllers/passengerAPI.js";

// Define routes and link to controller functions
const PassengerRouter = express.Router();

PassengerRouter.get("/", getPassengers);
// POST /Passengers
PassengerRouter.post("/", createPassenger);
// PUT /Passengers/:id
PassengerRouter.put("/:id", getPassengerByID);
// DELETE /Passengers/:id
PassengerRouter.delete("/:id", deletePassengerByID);
export default PassengerRouter;
