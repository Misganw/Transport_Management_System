import express from "express";
import { countryList } from "../../API/counttries.js";
import { countryPhoneCode } from "../../API/countryPhoneCode.js";
import { currencies, timezone } from "../../API/timeZoneandCurrencies.js";

const Countryrouter = express.Router();
Countryrouter.get("/countries", countryList);
Countryrouter.get("/countriesPhoneCode", countryPhoneCode);
Countryrouter.get("/currencies", currencies);
Countryrouter.get("/timezones", timezone);

export default Countryrouter;
