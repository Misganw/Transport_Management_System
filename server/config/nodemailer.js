import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.smtpUser,
    pass: process.env.smtpPassword,
  },
});
export default transporter;
