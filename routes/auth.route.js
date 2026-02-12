import express from "express";
import {
  initiateSignup,
  verifySignupOtp,
  login
} from "../controllers/auth.controller.js";
import { apiLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = express.Router();

/**
 * SIGNUP FLOW
 */

// Step 1: Initiate signup (generate OTP)
router.post("/signup/initiate", apiLimiter ,initiateSignup);

// Step 2: Verify OTP and create user
router.post("/signup/verify", verifySignupOtp);
router.post("/login", login);

export default router;
