// import dayjs from "dayjs";

// /**
//  * Convert a MongoDB timestamp to DD-MM-YYYY string
//  * @param {Date|string} timestamp
//  * @returns {string} e.g. "06-03-2026"
//  */
// export const formatDateDDMMYYYY = (timestamp) => {
//   return dayjs(timestamp).format("DD-MM-YYYY");
// };

// backend/utils/dateUtils.js

/**
 * Returns the date part of a Date or string in "YYYY-MM-DD" format
 * @param {Date|string} date
 * @returns {string} e.g. "2026-03-06"
 */
export const formatDateOnly = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0"); // month is 0-indexed
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
