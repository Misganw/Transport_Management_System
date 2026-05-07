import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
  try {
    // const { userID } = req;
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.json({ success: false, message: "User is not found" });
    }
    const backendURL = process.env.VITE_BACKEND_URL || "http://localhost:5000";
    const profilePicURL = user.profileImage
      ? `${backendURL}${user.profileImage}`
      : `${backendURL}/uploads/default-avatar.jpg`; // fallback image

    res.json({
      success: true,
      userData: {
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        profileImage: profilePicURL,
        roles: user.roles,
      },
    });
  } catch (error) {
    res.json({ success: true, message: error.message });
  }
};

// fetch all users
export const fetchUsers = async (req, res) => {
  try {
    const user = req.user;
    const users = await userModel.find({
      companyId: user.companyID,
    }); // fetch all users
    res.json(users);
    // console.log("companyId: " + user.companyID);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Access denied: insufficient role permissions" });
  }
};
