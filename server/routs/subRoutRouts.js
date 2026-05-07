import express from "express";
// Import controller functions
import { getRout, getRoutBySubrout } from "../controllers/subroutAPI.js";
import getUserID, { requireRole } from "../middleware/middleware.js";

// Define routes and link to controller functions
const SubroutRouter = express.Router();

// SubroutRouter.get("/", getUserID, requireRole("list", ...permissions.subrouts.list), getSubroutByRout);
SubroutRouter.get("/", getUserID, getRout);
SubroutRouter.get("/:subroutId", getUserID, getRoutBySubrout);
export default SubroutRouter;
