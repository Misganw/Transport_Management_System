import express from "express";
// Import controller functions
import {
  getPrograms,
  createProgram,
  getProgramByID,
  deleteProgramByID,
} from "../controllers/programAPI.js";

// Define routes and link to controller functions
const ProgramRouter = express.Router();

ProgramRouter.get("/", getPrograms);
// POST /Programs
ProgramRouter.post("/", createProgram);
// PUT /Programs/:id
ProgramRouter.put("/:id", getProgramByID);
// DELETE /Programs/:id
ProgramRouter.delete("/:id", deleteProgramByID);
export default ProgramRouter;
