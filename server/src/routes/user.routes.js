import express from "express";
import { getTokenLimitStatus } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/token-limit", authMiddleware, getTokenLimitStatus);

export default router;
