import userModel from "../models/userModel.js";
import passengersModel from "../models/passengersModel.js";
import companyModel from "../models/companyModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";

// End of impors

export const getCompanyId = async (req, res) => {
  try {
    const comp = await companyModel.find();
    res.json(comp);
  } catch (error) {
    console.error("Error fetching companyId:", error);
    return null;
  }
};
export const userRegistor = async (req, res) => {
  const {
    companyId,
    firstName,
    middleName,
    lastName,
    age,
    gender,
    fydano,
    email,
    password,
    roles,
    statuses,
  } = req.body;
  if (!email || !password) {
    return res.json({
      success: false,
      message: "Missing one or whole data entry",
    });
  }
  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User Already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 6);

    const profileImage = req.file ? `/uploads/${req.file.filename}` : "";
    const user = new userModel({
      companyId,
      firstName,
      middleName,
      lastName,
      name: `${firstName} ${middleName} ${lastName}`,
      email,
      password: hashedPassword,
      roles,
      statuses,
      age,
      gender,
      fydano,
      profileImage,
    });
    await user.save();

    // **Create passenger record at the same time if role is passenger**
    if (roles === "passenger") {
      await passengersModel.create({
        userId: user._id, // reference to users._id
        companyId: companyId, // or set default company if needed
        fName: firstName,
        mName: middleName,
        lName: lastName,
        age,
        gender,
        email,
        phone: "", // if you have phone in req.body, fill it
        RID: fydano, // or generate a unique RID if needed
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({ success: true, message: "You Sign up Successfully" });
    // .....sending Email
    const mailOption = {
      from: process.env.senderEmail,
      to: email,
      subject: "Welecome to ITSRS",
      text: `Welecom to Illegal transport service reporting system.Your account has been created with Email:${email}`,
    };
    await transporter.sendMail(mailOption);
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
// ........ End of userRegistor

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "Email and password are required",
    });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Invalid Email" });
    }

    const isMachPass = await bcrypt.compare(password, user.password);
    const status = user.statuses;
    if (!isMachPass) {
      return res.json({ success: false, message: "Invalid Password" });
    }
    if (status != "Active") {
      return res.json({ success: false, message: "User is not Activated!." });
    }

    // ........Session- cookie for Google sign in........
    // req.login(user, (err) => {
    //   if (err) return res.json({ success: false, message: err.message });
    //   return res.json({ success: true, user });
    // });
    // ........Session- cookie for Google sign in........

    // ....Token using JWT- cookie for both Google an dlocal  sign in
    const token = jwt.sign(
      {
        id: user._id,
        companyId: user.companyId,
        roles: user.roles,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    // ....Token using JWT- cookie for both Google an dlocal  sign in
    return res.json({ success: true, message: "Activated user!." });
  } catch (error) {
    return res.json({ succuss: false, message: error.message });
  }
};
// ........ End of login
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, message: "Logged out" });
  } catch (error) {
    return res.json({ succuss: false, message: error.message });
  }
};
// ......... End of logout

export const sendOTP = async (req, res) => {
  try {
    // const { userID } = req;
    const user = await userModel.findById(req.user.id);
    if (user.isVerified) {
      return res.json({
        success: true,
        message: "Account already verified!.",
      });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOTP = otp;
    user.verifyOTPExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();
    const mailOption = {
      from: process.env.senderEmail,
      to: user.email,
      subject: "Account Verification OTP generated",
      text: `Your account OTP is ${otp}. Please verify your account using this OTP.`,
    };
    await transporter.sendMail(mailOption);
    return res.json({
      success: true,
      message: `OTP sent to ${user.email}!.`,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
// ... End of send verification OTP to users Email
export const veriyemailwithOTP = async (req, res) => {
  // const { userID, otp } = req;
  const { otp } = req.body; // <-- OTP comes from body
  const userID = req.user.id; // <-- userID comes from middleware
  if (!userID || !otp) {
    return res.json({ success: false, message: "OTP Missed" });
  }
  try {
    const user = await userModel.findById(userID);
    if (!user) {
      return res.json({ success: false, message: "User doesn't found" });
    }
    if (user.verifyOTP === "" || user.verifyOTP !== otp) {
      return res.json({ success: false, message: "Not Verified!." });
    }
    if (user.verifyOTPExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP expired!." });
    }
    user.isVerified = true;
    user.verifyOTP = "";
    user.verifyOTPExpireAt = 0;
    await user.save();
    return res.json({ success: true, message: "email verified successfuly!." });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
// ... End of get the OTP and verify account

export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true, message: "User is authenticated!." });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
// ..... End of checking authentication

export const sendResetOTP = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.json({ success: false, message: "Email is required!." });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Email is not found!." });
    }
    // ✅ Check if an OTP already exists and has not expired
    if (
      user.resetOTP &&
      user.resetOTPExpireAt &&
      user.resetOTPExpireAt > Date.now()
    ) {
      return res.json({
        success: false,
        message:
          "An active OTP is already registered. Please check your email or wait for it to expire.",
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOTP = otp;
    user.resetOTPExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();
    return res.json({
      success: true,
      message: `Password resetting OTP is sent to your email: ${user.email}`,
    });

    const mailOption = {
      from: process.env.senderEmail,
      to: user.email,
      subject: "Password resetting OTP generated",
      text: `Your resetting OTP is ${otp}. Please reset your account using this OTP.`,
    };
    await transporter.sendMail(mailOption);
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
// .... End of password Resetting  OTP

export const resetpasswordwithOTP = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.json({
      success: false,
      message: "Email, OTP and New Password are required",
    });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User doesn't found" });
    }
    if (user.resetOTP === "" || user.resetOTP !== otp) {
      return res.json({ success: false, message: "Not Verified!." });
    }
    if (user.resetOTPExpireAt < Date.now()) {
      return res.json({ success: false, message: "reset OTP expired!." });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 6);
    user.password = hashedPassword;
    user.isVerified = true;
    user.resetOTP = "";
    user.resetOTPExpireAt = 0;
    await user.save();
    return res.json({
      success: true,
      message: "password reseted successfuly!.",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
// ... End of get reset OTP and Reset password function

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({
      success: false,
      message: "New Password required",
    });
  }

  try {
    // console.log("REQ.USERID:", req.userID);
    // console.log("BODY:", req.body);

    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(401).json({ success: false, message: "Not Verified." });
    }

    const matching = await bcrypt.compare(currentPassword, user.password);

    // console.log("PASSWORD MATCH:", matching);

    if (!matching) {
      return res
        .status(400)
        .json({ success: false, message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 6);
    await user.save();

    return res.json({
      success: true,
      message: "Password updated successfully!",
    });
  } catch (error) {
    // console.error("CHANGE PASSWORD ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ... End of get change password function
