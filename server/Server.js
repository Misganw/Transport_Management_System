import express, { Router } from "express";
import mongoose, { startSession } from "mongoose";
import multer from "multer";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import session from "express-session";
import passport from "./config/passport.js"; // import passport setup
import dotenv from "dotenv";
dotenv.config();

import getUserID, { requireRole } from "./middleware/middleware.js";
import { permissions } from "./API/permissions.js";
import path from "path";
import { fileURLToPath } from "url";
import "./services/ticketStatus.js";
import "./services/programStatus.js";

//......import Rout.....
import companyRouter from "./routs/companyRouts.js";
import router from "./routs/routs.js";
import Countryrouter from "./routs/apiRouts/apiRouts.js";
import { commonRouter } from "./routs/commonRout.js";

import RoutRouter from "./routs/routRouts.js";
import TicketRouter from "./routs/ticketRouts.js";
import TrafficPoliceRouter from "./routs/trafficPoliceRouts.js";
import SubroutRouter from "./routs/subRoutRouts.js";
import TrafficAssignmentRouter from "./routs/trafficPoliceAssignmentRouts.js";
import ReportRouter from "./routs/reportRouts.js";

//......import Rout.....

//......import controller.....
import carAPI from "./controllers/carAPI.js";
import employeeAPI from "./controllers/employeeAPI.js";
import driverApI from "./controllers/driverAPI.js";
import passengerAPI from "./controllers/passengerAPI.js";
import paymentAPI from "./controllers/paymentAPI.js";
import penalityAPI from "./controllers/penalityAPI.js";
import ownerAPI from "./controllers/ownerAPI.js";
import programAPI, { getprogramByRoute } from "./controllers/programAPI.js";
import reportAPI from "./controllers/reportAPI.js";
import routerAPI from "./controllers/routAPI.js";
import ruleAPI from "./controllers/ruleAPI.js";
import tarrifAPI, { getByRoute } from "./controllers/tarrifAPI.js";
import ticketAPI from "./controllers/ticketAPI.js";
import trafficPoliceAPI, {
  getTrafficPoliceBycompany,
} from "./controllers/trafficPoliceAPI.js";
import trafficAssignmentAPI from "./controllers/trafficAssignmentAPI.js";
import countryAPI from "./controllers/address/countryAPI.js";
import stateAPI from "./controllers/address/stateAPI.js";
import zoneAPI from "./controllers/address/zoneAPI.js";
import weredaAPI from "./controllers/address/weredaAPI.js";
import cityAPI from "./controllers/address/cityAPI.js";
import userAPI from "./controllers/userAPI.js";
import recycleAPI from "./controllers/recycleAPI.js";
import routAPI, { fetchRouts } from "./controllers/routAPI.js";
import stripeWebhook from "./webhooks/stripeWebhook.js";
import cancelledTicketAPI from "./controllers/cancelledTicketAPI.js";
import subroutAPI, { getRout } from "./controllers/subroutAPI.js";
//......import controller.....

// .... Socket ..........
import { Server } from "socket.io";
import http from "http";
// .... Socket ..........

import { upload } from "./emPhotoUpload.js";

// ............ END OF IMPORT .......

// --- For __dirname in ES Modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// ........ End of imports
const app = express();
const port = process.env.PORT || 5000;
connectDB();

// .......... stripe web hook .........
app.post(
  "/webhook/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhook,
);
// .......... stripe web hook .........

app.use(express.json());

app.use(cookieParser());
const allowFrontend = ["http://localhost:5173"];
// app.use(cors({ origin: "http://localhost:5173", credentials: true }));
// app.use(cors({ origin: "*", credentials: true })); // WARNING: Not recommended for production.
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  }),
);

/* ----------------- CREATE HTTP SERVER ----------------- */
const server = http.createServer(app);

/* ----------------- SOCKET.IO SETUP ----------------- */
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  },
});

/* ----------------- SOCKET CONNECTION ----------------- */
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

/* ----------------- MAKE IO AVAILABLE IN CONTROLLERS ----------------- */
app.set("io", io);

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/empPhotos", express.static(path.join(__dirname, "empPhotos")));
app.use("/ownerPhotos", express.static(path.join(__dirname, "ownerPhotos")));
app.use(
  "/companyLogos",
  express.static(path.join(process.cwd(), "companyLogos")),
);
// === Session setup for Passport ===
app.use(
  session({
    secret: process.env.JWT_SECRET || "fallback_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      domain: "localhost", // not localhost:5000, just localhost
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send(" API working correctly");
});
// app.use(getUserID);

app.use("/", router); // users routes
app.use("/", Countryrouter); // country api routes
app.use("/", companyRouter); // company routes
app.use("/", RoutRouter); // Rout routes
app.use("/", TicketRouter); // Ticket routes
app.use("/", TrafficPoliceRouter); // Traffic Police routes
app.use("/routsForSubrout", SubroutRouter); // Subrout routes
app.use("/tpassignment", TrafficAssignmentRouter);
app.use("/voilationReports", ReportRouter); //report routes

app.use("/cars", getUserID, commonRouter(carAPI, permissions.cars)); //car routes

//employee
app.post(
  "/employees",
  upload.single("profileImage"),
  getUserID,
  requireRole("create", ...(permissions.employees.create || [])),
  employeeAPI.create,
);
app.put(
  "/employees/:id",
  upload.single("profileImage"),
  getUserID,
  requireRole("update", ...(permissions.employees.update || [])),
  employeeAPI.update,
);
app.use(
  "/employees",
  getUserID,
  commonRouter(employeeAPI, permissions.employees, { skipCreate: true }),
); //employee routes
app.get("/getEmployeesByCompany", getUserID, employeeAPI.getEmployeesByCompany);

app.use("/drivers", getUserID, commonRouter(driverApI, permissions.drivers)); //driver routes

app.use(
  "/passengers",
  getUserID,
  commonRouter(passengerAPI, permissions.passengers),
); //passenger routes

app.use("/payments", getUserID, commonRouter(paymentAPI, permissions.payments)); //payment routes

app.use(
  "/penalties",
  getUserID,
  commonRouter(penalityAPI, permissions.penalities),
); //penality routes
app.use("/owners", getUserID, commonRouter(ownerAPI, permissions.owners)); //owner routes
app.use("/programs", getUserID, commonRouter(programAPI, permissions.programs)); //program routes
app.use("/reports", getUserID, commonRouter(reportAPI, permissions.reports)); //report routes
// app.use("/routes", getUserID, commonRouter(routerAPI, permissions.routs)); //rout routes
app.use("/rules", getUserID, commonRouter(ruleAPI, permissions.rules)); //rule routes
// app.use("/tariffs", getUserID, commonRouter(tarrifAPI, permissions.tarrifs));
app.use("/ticketes", getUserID, commonRouter(ticketAPI, permissions.tickets)); //ticket routes
app.use(
  "/cancelledTickets",
  getUserID,
  commonRouter(cancelledTicketAPI, permissions.cancelledTickets),
); //cancelled ticket routes
app.use(
  "/trafficPolice",
  upload.single("profileImage"),
  getUserID,
  commonRouter(trafficPoliceAPI, permissions.trafficPolice),
); //trafficPolice routes

app.get("/getTrafficPoliceBycompany", getUserID, getTrafficPoliceBycompany); // traffic police by company routes

app.use(
  "/policeAssignment",
  getUserID,
  commonRouter(trafficAssignmentAPI, permissions.trafficAssignments),
); //trafficPoliceAssignment routes

// ... country routes with custom delete handler
app.use("/cntry", getUserID, commonRouter(countryAPI, permissions.country));
// console.log("permissions.state =", permissions.state);
app.use("/states", getUserID, commonRouter(stateAPI, permissions.state));
app.use("/zones", getUserID, commonRouter(zoneAPI, permissions.zone));
app.use("/weredas", getUserID, commonRouter(weredaAPI, permissions.wereda));
app.use("/cities", getUserID, commonRouter(cityAPI, permissions.city));
app.use("/users", getUserID, commonRouter(userAPI, permissions.user));
app.get("/routsforHome", fetchRouts);
app.use("/routs", getUserID, commonRouter(routAPI, permissions.routs));
app.use("/subrouts", getUserID, commonRouter(subroutAPI, permissions.subrouts));

app.use("/tarrifs", getUserID, commonRouter(tarrifAPI, permissions.tarrif));
app.use(
  "/violations",
  getUserID,
  commonRouter(reportAPI, permissions.violation),
);

//recycle bin
app.use(
  "/recycleBin",
  getUserID,
  commonRouter(recycleAPI, permissions.recycleBin),
);
//Custome Rout
//cars

//drivers
//passenger
//payment
//penality
//owner
app.get("/customOwner", getUserID, ownerAPI.listByCompany);
//program
app.get("/programsbyRoute/:routId", getprogramByRoute);
//report
//rout
//rule
//tarrif
app.get("/tarrifsbyRoute/:routId", getByRoute);
//ticket
//trafficPolice
app.get("/", getUserID, getTrafficPoliceBycompany);
//trafficAssignment
//Ttaffic Assignment
//country
//state
app.get("/getStateByCountry", getUserID, stateAPI.getStateByCountry);
//zone
app.get("/getZoneByState", getUserID, zoneAPI.getZoneByState);
//wereda
app.get("/getWeredaByZone", getUserID, weredaAPI.getWeredaByZone);
//city
app.get("/getCityByWereda", getUserID, cityAPI.getCityByWereda);

// app.listen(port, () => {
//   console.log(`Server Started on PORT:${port}`);
// });

// ...... added after socket implementation ......
server.listen(port, () => {
  console.log(`Server Started on PORT:${port}`);
});
