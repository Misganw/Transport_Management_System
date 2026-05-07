import express from "express";
// Import controller functions
import {
  getCompany,
  getRoutByCompany,
  searchRout,
} from "../controllers/routAPI.js";

// Define routes and link to controller functions
const RoutRouter = express.Router();

RoutRouter.get("/getCompany", getCompany);
RoutRouter.get("/routByCompany/:companyId", getRoutByCompany);
RoutRouter.get("/searchRout", searchRout);
export default RoutRouter;
