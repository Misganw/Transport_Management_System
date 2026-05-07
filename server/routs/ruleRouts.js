import express from "express";
// Import controller functions
import {
  getRules,
  createRule,
  getRuleByID,
  deleteRuleByID,
} from "../controllers/ruleAPI.js";

// Define routes and link to controller functions
const RuleRouter = express.Router();

RuleRouter.get("/", getRules);
// POST /Rules
RuleRouter.post("/", createRule);
// PUT /Rules/:id
RuleRouter.put("/:id", getRuleByID);
// DELETE /Rules/:id
RuleRouter.delete("/:id", deleteRuleByID);
export default RuleRouter;
