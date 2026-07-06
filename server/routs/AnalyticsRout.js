import express from "express";
import {
  countCars,
  countDrivers,
  countPassengers,
  countPrograms,
  countTickets,
  countReports,
  countEmployees,
  countOwners,
  countPayments,
  countPenalities,
  countRules,
  countTarrifs,
  countTraffic,
  countRoutes,
  countSubroutes,
  countUsers,
  getTotalRevenue,
  getCarsGroupedByType,
  getPaymentTrends,
  getpaidTickets,
  getTicketPaymentAnalytics,
  getMonthlyPerformanceMetrics,
  getTopRoutesMetrics,
} from "../controllers/analyticsAPI.js";
import { getSubrouteViolationTrends } from "../controllers/violationAnalytics.js";
import getUserID from "../middleware/middleware.js";

const AnalyticsRouter = express.Router();

AnalyticsRouter.get("/analytics/countCars", getUserID, countCars);
AnalyticsRouter.get("/analytics/countDrivers", getUserID, countDrivers);
AnalyticsRouter.get("/analytics/countPassengers", getUserID, countPassengers);
AnalyticsRouter.get("/analytics/countPrograms", getUserID, countPrograms);
AnalyticsRouter.get("/analytics/countTickets", getUserID, countTickets);
AnalyticsRouter.get("/analytics/countViolations", getUserID, countReports);
AnalyticsRouter.get("/analytics/countEmployees", getUserID, countEmployees);
AnalyticsRouter.get("/analytics/countOwners", getUserID, countOwners);
AnalyticsRouter.get("/analytics/countPayments", getUserID, countPayments);
AnalyticsRouter.get("/analytics/countPenalities", getUserID, countPenalities);
AnalyticsRouter.get("/analytics/countRules", getUserID, countRules);
AnalyticsRouter.get("/analytics/countTarrifs", getUserID, countTarrifs);
AnalyticsRouter.get("/analytics/countTraffic", getUserID, countTraffic);
AnalyticsRouter.get("/analytics/countRoutes", getUserID, countRoutes);
AnalyticsRouter.get("/analytics/countSubroutes", getUserID, countSubroutes);
AnalyticsRouter.get("/analytics/countUsers", getUserID, countUsers);
AnalyticsRouter.get("/analytics/revenue", getUserID, getTotalRevenue);
AnalyticsRouter.get("/analytics/carsByType", getUserID, getCarsGroupedByType);
AnalyticsRouter.get("/analytics/paymentTrends", getUserID, getPaymentTrends);
AnalyticsRouter.get("/analytics/paidTickets", getUserID, getpaidTickets);
AnalyticsRouter.get(
  "/analytics/ticketPaymentAnalytics",
  getUserID,
  getTicketPaymentAnalytics,
);
AnalyticsRouter.get(
  "/analytics/ViolationTrends",
  getUserID,
  getSubrouteViolationTrends,
);
AnalyticsRouter.get(
  "/analytics/monthlyPerformanceOnTable",
  getUserID,
  getMonthlyPerformanceMetrics,
);

AnalyticsRouter.get("/analytics/topRoutes", getUserID, getTopRoutesMetrics);
export default AnalyticsRouter;
