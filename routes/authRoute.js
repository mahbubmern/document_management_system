import express from "express";
import {
  registerUser,
  accountActivationByOTP,
  login,
  getUserProfile,
  logout,
  forgotPassword,
  forgotPasswordByOtp,
  newActivationOTP,
} from "../controllers/authController.js";
import tokenVerify from "../middleware/tokenVerify.js";

// router initialize

const router = express.Router();

// route set

router.post("/register", registerUser);
router.post("/login", login);
router.get("/me", tokenVerify, getUserProfile);
router.post("/account-activate-by-otp/:token", accountActivationByOTP);
router.post("/forgot-password", forgotPassword);
router.post("/forgot-password-by-otp/:token", forgotPasswordByOtp);
router.post("/new-activation-otp", newActivationOTP);
router.post("/logout", logout);

export default router
