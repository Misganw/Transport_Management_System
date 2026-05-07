import { makeService } from "./services.js";
import instance from "./services.js";
export const carServices = makeService("cars"); // Cars
export const driverServices = makeService("drivers"); // Drivers
export const cancelledTicketServices = makeService("cancelledTickets"); // Cancelled Tickets
export const employeeServices = makeService("employees"); // Employees
export const penalityServices = makeService("penalties"); // Penalties
export const paymentServices = makeService("payments"); // Payments
// export const routeServices = makeService("routes"); // Routes
export const tarrifServices = makeService("tariffs"); // Tarrifs
export const ruleServices = makeService("rules"); // Rules
export const trafficPoliceServices = makeService("trafficPolice"); // Traffic Police
export const PoliceAssignmentServices = makeService("policeAssignment"); // Police Assignment
export const programServices = makeService("programs"); // Programs
export const passengerServices = makeService("passengers"); //  Passengers
export const ownerServices = makeService("owners"); // Owners
export const countryService = makeService("cntry", true, false); // Country
export const stateService = makeService("states"); // State
export const zoneService = makeService("zones"); // zone
export const weredaService = makeService("weredas"); // wereda
export const cityService = makeService("cities"); // city
export const usersService = makeService("users"); // city
export const recycleBinService = makeService("recycleBin", false, true); // Recycle Bin
export const routService = makeService("routs"); // Routs
export const subRoutServices = makeService("subrouts"); // Subrouts
export const tarrifService = makeService("tarrifs"); // Tarrifs
export const ticketService = makeService("ticketes"); // Tickets
export const voilationService = makeService("violations"); // Violations

// export const createEmployee = {
//   createEmployee: () =>
//     instance.post("/createEmployee", { withCredentials: true }),
// };

export const employeeByCompany = {
  getEmployeesByCompany: () =>
    instance.get("/getEmployeesByCompany", { withCredentials: true }),
};

export const ownerByCompany = {
  ...makeService("owners"),
  listByCompany: () => instance.get("/customOwner", { withCredentials: true }),
};
export const stateByCountry = {
  getStateByCountry: (params) =>
    instance.get("/getStateByCountry", { params }, { withCredentials: true }),
};
export const zoneByState = {
  getZoneByState: (params) =>
    instance.get("/getZoneByState", { params }, { withCredentials: true }),
};
export const weredaByZone = {
  getWeredaByZone: (params) =>
    instance.get("/getWeredaByZone", { params }, { withCredentials: true }),
};
export const cityByWereda = {
  getCityByWereda: (params) =>
    instance.get("/getCityByWereda", { params }, { withCredentials: true }),
};
export const tarrifByRoute = {
  getTarrifByRoute: (routId) => instance.get(`/tarrifsbyRoute/${routId}`),
};
export const tarrifSearch = {
  getTarrifByRoute: (routId, search = "") =>
    instance.get(`/tarrifsbyRoute/${routId}`, { params: { search } }),
};
export const programByRoute = {
  getprogramByRoute: (routId) => instance.get(`/programsbyRoute/${routId}`),
};
export const programSearch = {
  getprogramByRoute: (routId, search = "") =>
    instance.get(`/programsbyRoute/${routId}`, { params: { search } }),
};
