import express from "express";
import Car from "../../models/carsModel.js";
import Driver from "../../models/driversModel.js";
import Employee from "../../models/employeeModel.js";
import Owner from "../../models/ownersModel.js";
import Passennger from "../../models/passengersModel.js";
import Paymement from "../../models/paymentsModel.js";
import Penality from "../../models/penalityModel.js";
import Program from "../../models/programsModel.js";
import Reports from "../../models/reportsModel.js";
import Route from "../../models/routsModel.js";
import Rules from "../../models/rulesModel.js";
import Tarrif from "../../models/tarrifModel.js";
import Ticket from "../../models/ticketsModel.js";
import TrafficAssinment from "../../models/traficAssignmentModel.js";
import TrafficPolice from "../../models/traficPoliceModel.js";
import User from "../../models/userModel.js";
import systemReference from "../../models/systemReference/systemReferenceModel.js";
import Country from "../../models/addressModel/countryModel.js";
import State from "../../models/addressModel/stateModel.js";
import Zone from "../../models/addressModel/zoneModel.js";
import Werda from "../../models/addressModel/weredaModel.js";
import City from "../../models/addressModel/cityModel.js";

import bcrypt from "bcryptjs";

export const seedDefaultRecords = async (companyId, email) => {
  function generateCDL2() {
    const letters = Array.from({ length: 2 }, () =>
      String.fromCharCode(65 + Math.floor(Math.random() * 26))
    ).join("");

    const digits = Math.floor(100000 + Math.random() * 900000); // 6 digits

    return `${letters}${digits}`;
  }
  // Generate a random SSID
  function generateSSIDPlain() {
    return Math.random().toString().slice(2, 11); // 9 digits
  }
  const cdl = generateCDL2();
  const ssid = generateSSIDPlain();

  // 1. Default Admin User
  const password = "admin123";
  const hashedPassword = await bcrypt.hash(password, 6);
  const admin = await User.create({
    companyId,
    name: "System Admin",
    age: 30,
    gender: "Male",
    email: email,
    password: hashedPassword,
    roles: "admin",
    statuses: "Active",
  });
  // 2. Default owner
  const owner = await Owner.create({
    companyId,
    userId: admin._id,
    fName: "Owner First Name",
    mName: "Owner Middle Name",
    lName: "Owner Last Name",
    age: 30,
    gender: "Male",
    RID: ssid,
    country: "  Ethiopia",
    state: "Addis Ababa",
    zone: "Addis Ababa",
    city: "Addis Ababa",
    wereda: "01",
    email: `owner_${email}`,
    phone: "123-456-7890",
  });

  // 3. Default Car
  const car = await Car.create({
    companyId,
    userId: admin._id,
    ownerId: owner._id,
    type: "Sedan",
    model: "Toyota Camry",
    plateNumber: "ABC-1234",
    level: "Premium",
    value: 30000,
    NoofSeats: "5",
  });

  // 4. Default Driver
  const driver = await Driver.create({
    companyId,
    userId: admin._id,
    carId: car._id,
    fName: "Driver First Name",
    mName: "Driver Middle Name",
    lName: "Driver Last Name",
    age: 28,
    gender: "Female",
    CDL: cdl,
    RID: ssid,
    drivingExperience: 5,
    country: "  Ethiopia",
    state: "Addis Ababa",
    zone: "Addis Ababa",
    city: "Addis Ababa",
    wereda: "01",
    email: `owner_${email}`,
    phone: "123-456-7890",
  });

  // 5. Default Route
  const route = await Route.create({
    companyId,
    userId: admin._id,
    departure: "Default Departure",
    arrival: "Default Arrival",
  });

  // 6. Default Program

  const program = await Program.create({
    companyId,
    userId: admin._id,
    routeId: route._id,
    carId: car._id,
    QueueNo: 1,
    Tarrif: 100,
    NoofSeats: 50,
    Date: new Date(),
  });

  // 7. Default Passenger
  const passenger = await Passennger.create({
    companyId,
    userId: admin._id,
    fName: "Passenger First Name",
    mName: "Passenger Middle Name",
    lName: "Passenger Last Name",
    age: 28,
    gender: "Female",
    RID: ssid,
    country: "  Ethiopia",
    state: "Addis Ababa",
    zone: "Addis Ababa",
    city: "Addis Ababa",
    wereda: "01",
    email: `owner_${email}`,
    phone: "123-456-7890",
  });

  // 8. Default Ticket

  const ticket = await Ticket.create({
    companyId,
    userId: admin._id,
    programId: program._id,
    passengerId: passenger._id,
    seatNumber: 1,
    seatCount: 1,
    TicketPrice: 100,
    purchaseDate: new Date(),
    Status: "Booked",
  });

  // 9. Default Rules
  const rules = await Rules.create({
    companyId,
    userId: admin._id,
    title: "Default Rule",
    description: "This is a default rule description.",
  });

  // 10. Default Traffic Police
  const trafficPolice = await TrafficPolice.create({
    companyId,
    userId: admin._id,
    fName: "Police First Name",
    mName: "Police Middle Name",
    lName: "Police Last Name",
    age: 35,
    gender: "Male",
    RID: ssid,
    rank: "Sergeant",
    exprience: 10,
    country: "Ethiopia",
    state: "Addis Ababa",
    zone: "Addis Ababa",
    city: "Addis Ababa",
    wereda: "01",
    email: `police_${email}`,
    phone: "987-654-3210",
  });

  // 11. Default Traffic Police Assignment
  const trafficAssignment = await TrafficAssinment.create({
    companyId,
    userId: admin._id,

    trafficOfficerId: trafficPolice._id,
    routeId: route._id,
    assignmentDate: new Date(),
    details: "Default assignment details.",
  });

  // 12. Default Report
  const report = await Reports.create({
    companyId,
    ticketId: ticket._id,
    ruleID: rules._id,
    officerAssignmentId: trafficAssignment._id,
    title: "Default Report",
    description: "This is a default report content.",
  });

  // 13. Default Tarrif
  const tarrif = await Tarrif.create({
    companyId,
    userId: admin._id,
    routeId: route._id,
    carID: car._id,
    amount: 100,
  });

  // 14. Default Penality
  const penality = await Penality.create({
    companyId,
    userId: admin._id,
    routeId: route._id,
    programId: program._id,
    carId: car._id,
    driverId: driver._id,
    reportId: report._id,
    amount: 50,
    reason: "Default Penality Reason",
  });

  // 15. Default Payment
  const payment = await Paymement.create({
    companyId,
    userId: admin._id,
    penalityId: penality._id,
    amount: 100,
    paymentDate: new Date(),
    paymentMethod: "Credit Card",
    referenceNumber: ssid,
  });
  // 16. Default Employee
  const employee = await Employee.create({
    companyId,
    userId: admin._id,
    fName: "Employee First Name",
    mName: "Employee Middle Name",
    lName: "Employee Last Name",
    age: 30,
    gender: "Male",
    RID: ssid,
    position: "Manager",
    department: "Operations",
    exprience: 5,
    country: "Ethiopia",
    state: "Addis Ababa",
    zone: "Addis Ababa",
    wereda: "01",
    city: "Addis Ababa",
    email: `employee_${email}`,
    phone: "555-123-4567",
  });
  // Default System Reference
  const systemRef = await systemReference.create({
    companyId,
    userId: admin._id,
    currency: "ETB",
    timeZone: "Africa/Addis_Ababa",
    visibility: "Gevornmental",
  });
  // Default Country
  const defaultCountry = await Country.create({
    companyId,
    userId: admin._id,
    cName: "Ethiopia",
  });
  // Default State
  const defaultState = await State.create({
    companyId,
    userId: admin._id,
    countryId: defaultCountry._id,
    stateName: "Ethiopia",
  });

  // Default zone
  const defaultZone = await Zone.create({
    companyId,
    userId: admin._id,
    stateId: defaultState._id,
    zoneName: "Default Zone",
  });
  // Default Werda
  const defaultWereda = await Werda.create({
    companyId,
    userId: admin._id,
    zoneId: defaultZone._id,
    weredaName: "Default Wereda",
  });
  // Default City
  const defaultCity = await City.create({
    companyId,
    userId: admin._id,
    weredaId: defaultWereda._id,
    cityName: "Default Addiss Ababa",
  });
  return true;
};
