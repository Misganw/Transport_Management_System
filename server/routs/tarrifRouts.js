import express from "express";
// Import controller functions
import {
  getTarrifs,
  createTarrif,
  getTarrifByID,
  deleteTarrifByID,
} from "../controllers/tarrifAPI.js";

// Define routes and link to controller functions
const TarrifRouter = express.Router();

TarrifRouter.get("/", getTarrifs);
// POST /Tarrifs
TarrifRouter.post("/", createTarrif);
// PUT /Tarrifs/:id
TarrifRouter.put("/:id", getTarrifByID);
// DELETE /Tarrifs/:id
TarrifRouter.delete("/:id", deleteTarrifByID);
export default TarrifRouter;
