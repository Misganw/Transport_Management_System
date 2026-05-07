import express from "express";
import {
  createCompany,
  getCompanies,
  getComById,
  updateCompany,
  updatePreference,
  getPreference,
} from "../controllers/companyController.js";
import getUserID from "../middleware/middleware.js";
import { logoupload as upload } from "../logoUpload.js";

const companyRouter = express.Router();

companyRouter.post(
  "/registerCompany",
  upload.single("profileImage"),
  createCompany
);
companyRouter.get("/", getCompanies);
companyRouter.get("/getComById", getUserID, getComById);
companyRouter.put(
  "/updateCompany",
  getUserID,
  upload.single("profileImage"),
  updateCompany
);
companyRouter.get("/get_Preference", getUserID, getPreference);
companyRouter.put("/up_Preference", getUserID, updatePreference);

export default companyRouter;
