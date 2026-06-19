import express from "express";
// Import controller functions
import { getTarrifByRouteAndCar } from "../controllers/tarrifAPI.js";

// Define routes and link to controller functions
const TarrifRouter = express.Router();

TarrifRouter.get("/getTarrifByRouteAndCar", getTarrifByRouteAndCar);
export default TarrifRouter;
