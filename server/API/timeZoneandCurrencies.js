import express from "express";
import { currencies } from "country-data";
import moment from "moment-timezone";

// GET all currencies
const getGurrencies = async (req, res) => {
  try {
    // Map all currencies to { code, name }
    const allCurrencies = Object.values(currencies).map((c) => ({
      code: c.code,
      name: c.name,
    }));

    // Remove duplicates (some currencies repeat)
    const uniqueCurrencies = [
      ...new Map(allCurrencies.map((c) => [c.code, c])).values(),
    ];

    res.json({ success: true, currencies: uniqueCurrencies });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch currencies" });
  }
};

// GET all timezones
const getTimezone = async (req, res) => {
  try {
    const allTimezones = moment.tz.names(); // Returns array of strings
    res.json({ success: true, timezones: allTimezones });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch timezones" });
  }
};
export { getGurrencies as currencies, getTimezone as timezone };
