import bcrypt from "bcrypt";
import Users from "../models/users.model.js";
import { validatePassword } from "../utils/validatePassword.js";

//Get all users
export const getAllUsers = async () => {
  const users = await Users.findAll({
    attributes: { exclude: ["password"] },
  });
  return users;
};

//Find user by ID
export const getUserById = async (id) => {
  //Finding userId in database
  const user = await Users.findByPk(id, {
    attributes: { exclude: ["password"] },
  });
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return user;
};

//Update isActive status for a user
export const updateUserStatus = async (id, newStatus) => {
  const user = await Users.findByPk(id, {
    attributes: { exclude: ["password"] },
  });
  if (!user) {//db te check kortese id ase kina
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  user.isActive = newStatus;
  await user.save();

  return user;
};

//Update password for a user
export const updateUserPassword = async (id, newPassword) => {
  //Validate new password
  if (!validatePassword(newPassword)) {
    const error = new Error("Password must be at least 8 characters");
    error.statusCode = 400;
    throw error;
  }

  const user = await Users.findByPk(id);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  //Hash and save new password
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
};

//Update own profile for a user
export const updateOwnProfile = async (id, { firstname, lastname }) => {
  const user = await Users.findByPk(id, {
    attributes: { exclude: ["password"] },
  });
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (firstname !== undefined)
  {
    user.firstname = firstname;
  }
  if (lastname !== undefined)
  {
    user.lastname = lastname;
  }
  await user.save();

  return user;
};

//Update profile image for a user
export const updateUserProfileImage = async (id, imagePath) => {
  const user = await Users.findByPk(id, {
    attributes: { exclude: ["password"] },
  });
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  user.profileImage = imagePath;
  await user.save();

  return user;
};
