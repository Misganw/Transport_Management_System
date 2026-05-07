import express from "express";
import { allCountries } from "country-telephone-data";

const countryPhoneCode = (req, res) => {
  try {
    // Extract country codes and phone codes
    const countriesPhoneCode = allCountries.map((c) => ({
      name: c.name,
      dial_code: `+${c.dialCode}`,
      minLength: c.format?.minLength || 7,
      maxLength: c.format?.maxLength || 15,
    }));
    // Sort countries by name
    countriesPhoneCode.sort((a, b) => a.name.localeCompare(b.name));
    res.status(200).json({ success: true, countriesPhoneCode });
  } catch (error) {
    console.error("Error fetching country phone codes:", error);
    res

      .status(500)
      .json({ success: false, message: "Failed to fetch country phone codes" });
  }
};
export { countryPhoneCode };
