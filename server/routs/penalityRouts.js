import express from "express";
// Import controller functions
import {
  getPenalities,
  createPenalities,
  getPenalitiesByID,
  deletePenalitiesByID,
} from "../controllers/penalityAPI.js";
// Define routes and link to controller functions
const PenalityRouter = express.Router();

PenalityRouter.get("/", getPenalities);
// POST /Penalities
PenalityRouter.post("/", createPenalities);
// PUT /Penalities/:id
PenalityRouter.put("/:id", getPenalitiesByID);
// DELETE /Penalities/:id
PenalityRouter.delete("/:id", deletePenalitiesByID);
export default PenalityRouter;
