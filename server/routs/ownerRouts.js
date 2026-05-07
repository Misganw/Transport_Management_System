import express from "express";
// Import controller functions
import ownerAPI from "../controllers/ownerAPI.js";

// Define routes and link to controller functions
const OwnerRouter = express.Router();

OwnerRouter.get("/List", ownerAPI.list);
OwnerRouter.get("/getByID/:id", ownerAPI.getOne);
// POST /Owners
OwnerRouter.post("/create", ownerAPI.create);
// PUT /Owners/:id
OwnerRouter.put("/update/:id", ownerAPI.update);
// DELETE /Owners/:id
OwnerRouter.delete("/delete/:id", ownerAPI.remove);

OwnerRouter.put("/getByCompany", ownerAPI.listByCompany);
export default OwnerRouter;
