import express from "express";
import jwt from "jsonwebtoken";
const getUserID = async (req, res, next) => {
  // ....Session - cookie for both Google and local  sign in
  // if (req.isAuthenticated() && req.user) {
  //   req.userID = req.user._id;
  //   return next();
  // }
  // return res.json({ success: false, message: "Not authorized. Login again!" });
  // ....Session - cookie for both Google and local  sign in

  // ....Token using JWT- cookie for both Google and local  sign in
  const { token } = req.cookies;
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized.login again!." });
  }
  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    if (tokenDecode.id) {
      req.user = {
        id: tokenDecode.id,
        companyID: tokenDecode.companyId,
        roles: tokenDecode.roles,
      };

      // console.log(req.user);
    } else {
      return res.json({
        success: false,
        message: "Not authorized.login again!.",
      });
    }
    next();
    // ....Token using JWT- cookie for both Google an dlocal  sign in
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// ======================
// ROLE MIDDLEWARE
// ======================
export const requireRole = (action, ...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.roles;

    if (!userRole) {
      return res
        .status(401)
        .json({ success: false, message: "No role assigned" });
    }
    // If public → allow everyone
    if (allowedRoles.includes("public")) {
      return next();
    }
    // console.log("User Role:", userRole);
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied: insufficient permissions for : ${action}`,
      });
    }

    next();
  };
};

export default getUserID;
