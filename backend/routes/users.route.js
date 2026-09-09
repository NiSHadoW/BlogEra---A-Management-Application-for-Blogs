import { Router } from "express";
import {
  getUsers,
  getProfile,
  updateProfile,
  updatePassword,
  getUser,
  updateStatus,
  uploadProfileImage,
} from "../controller/users.controller.js";
import authMiddleWare, { isAdmin } from "../middlewares/auth.middleware.js";
import uploadProfileImageMiddleware from "../middlewares/upload.middleware.js";

const router = Router();

router.get("/users", authMiddleWare, isAdmin, getUsers);
router.get("/users/profile", authMiddleWare, getProfile);
router.put("/users/profile/update", authMiddleWare, updateProfile);
router.patch("/users/password", authMiddleWare, updatePassword);
router.patch(
  "/users/profile/image",
  authMiddleWare,
  (req, res, next) => {
    uploadProfileImageMiddleware.single("image")(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: err.message || "Image upload failed" });
      }
      next();
    });
  },
  uploadProfileImage
);
router.get("/users/:id", authMiddleWare, isAdmin, getUser);
router.patch("/users/:id/status", authMiddleWare, isAdmin, updateStatus);

export default router;
