import express from "express";
// Import controller functions
import carAPI from "../controllers/carAPI.js";

// Define routes and link to controller functions
const CarRouter = express.Router();

CarRouter.get("/list", carAPI.list);
CarRouter.get("/getByID:id", carAPI.list);
// POST /cars
CarRouter.post("/create", carAPI.create);
// PUT /cars/:id
CarRouter.put("/update/:id", carAPI.update);
// DELETE /cars/:id
CarRouter.delete("/delete/:id", carAPI.remove);
export default CarRouter;
