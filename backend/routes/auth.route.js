import { Router } from "express";
import { signUp, login, forgotPasswordHandler, resetPasswordHandler } from "../controller/auth.controller.js";

const router = Router();

router.post("/auth/register", signUp);//to register users
router.post("/auth/login", login);// to login any user
router.post("/auth/forgot-password", forgotPasswordHandler);// request a password reset email
router.patch("/auth/reset-password/:token", resetPasswordHandler);// reset password using emailed token

export default router;
