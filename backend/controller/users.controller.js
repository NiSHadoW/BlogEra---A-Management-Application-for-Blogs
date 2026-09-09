import {
  getAllUsers,
  getUserById,
  updateUserStatus,
  updateOwnProfile,
  updateUserPassword,
  updateUserProfileImage,
} from "../services/users.services.js";

//View all users - (Admin)
export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    });
  }
};

//View own profile - (Admin, User)
export const getProfile = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    res.status(200).json({
      message: "Profile fetched successfully",
      data: user,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    });
  }
};

//Get user by ID - (Admin)
export const getUser = async (req, res) => {
  const userId = Number(req.params.id);
  //Checking validity of userId from api end before reaching database
  if (!userId) {
    return res.status(400).json({
      message: "Invalid user id",
    });
  }

  try {
    const user = await getUserById(userId);
    res.status(200).json({
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    });
  }
};

//Activate/deactivate a user - (Admin)
export const updateStatus = async (req, res) => {
  const userId = Number(req.params.id);
  if (!userId) //postman er url e input validation check kortese, db touch korar age
  {
    return res.status(400).json({
      message: "Invalid user id"
    });
  }

  const { isActive } = req.body;
  if (typeof isActive !== "boolean") {
    return res.status(400).json({
      message: "isActive must be a boolean"
    });
  }

  try {
    const user = await updateUserStatus(userId, isActive);
    res.status(200).json({
      message: "User status updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    });
  }
};

//Update own profile - (Admin, User)
export const updateProfile = async (req, res) => {
  const { firstname, lastname } = req.body;

  try {
    const user = await updateOwnProfile(req.user.id, { firstname, lastname });
    res.status(200).json({
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    });
  }
};

//Update own password - (Admin, User)
export const updatePassword = async (req, res) => {
  const { password } = req.body;

  try {
    await updateUserPassword(req.user.id, password);
    res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    });
  }
};

//Upload/replace own profile image - (Admin, User)
export const uploadProfileImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: "Image file is required",
    });
  }

  const imagePath = `/uploads/profile-images/${req.file.filename}`;

  try {
    const user = await updateUserProfileImage(req.user.id, imagePath);
    res.status(200).json({
      message: "Profile image updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    });
  }
};
