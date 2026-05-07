import express from "express";
import getUserID, { requireRole } from "../middleware/middleware.js";
import {
  userRegistor,
  login,
  logout,
  sendOTP,
  veriyemailwithOTP,
  isAuthenticated,
  sendResetOTP,
  resetpasswordwithOTP,
  changePassword,
  getCompanyId,
} from "../controllers/authController.js";
import { fetchUsers, getUserData } from "../controllers/userController.js";
import { upload } from "../upload.js";
import multer from "multer";
import passport from "../config/passport.js";
import "dotenv/config";
import jwt from "jsonwebtoken";
import { permissions } from "../API/permissions.js";
// end of Imorting

const router = express.Router();
router.post("/register", upload.single("profileImage"), userRegistor);
router.post("/login", login);
router.post("/logout", logout);
router.post("/sendingOTP", getUserID, sendOTP);
router.post("/verifyemailwithOTP", getUserID, veriyemailwithOTP);
router.get("/checkAuthenticaion", getUserID, isAuthenticated);
router.post("/resetOTP", sendResetOTP);
router.post("/resetpassword", resetpasswordwithOTP);
router.get("/getUserData", getUserID, getUserData);
router.put("/changepassword", getUserID, changePassword);
router.get("/getCompanyId", getCompanyId);
// const role = ["admin", "manager"];
// router.get(
//   "/fetchUsers",
//   getUserID,
//   requireRole("fetchUsers", ...role),
//   fetchUsers
// );

// Google Autentication rout
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: true,
  }),
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
    session: true,
  }),
  (req, res, next) => {
    // ✅ Issue your JWT manually
    const token = jwt.sign(
      {
        id: req.user._id,
        roles: req.user.roles,
        companyId: req.user.companyId,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    // Successful login
    // res.redirect("http://localhost:5173/adminDashboard");
    res.redirect("http://localhost:5173/google-success");
  },
);

// // Facebook Autentication rout
// router.get(
//   "/auth/facebook",
//   passport.authenticate("facebook", { scope: ["email"] })
// );
// router.get(
//   "/auth/facebook/callback",
//   passport.authenticate("facebook", {
//     failureRedirect: "/login",
//     session: true,
//   }),
//   (req, res) => {
//     res.redirect("/adminDashboard");
//   }
// );

// GitHub Autentication rout
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
);
router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    session: true,
  }),
  (req, res, next) => {
    // ✅ Issue your JWT manually
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    // Successful login
    // res.redirect("http://localhost:5173/adminDashboard");
    res.redirect("http://localhost:5173/google-success");
  },
);

export default router;
