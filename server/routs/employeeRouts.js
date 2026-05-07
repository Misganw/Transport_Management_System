import express from "express";
// Import controller functions
import {
  getEmployees,
  createEmployee,
  getEmployeeByID,
  deleteEmployeeByID,
} from "../controllers/employeeAPI.js";

// Define routes and link to controller functions
const EmployeeRouter = express.Router();

EmployeeRouter.get("/", getEmployees);
// POST /Employees
EmployeeRouter.post("/", createEmployee);
// PUT /Employees/:id
EmployeeRouter.put("/:id", getEmployeeByID);
// DELETE /Employees/:id
EmployeeRouter.delete("/:id", deleteEmployeeByID);
export default EmployeeRouter;
