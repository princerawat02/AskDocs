import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  askQuestion,
  createChat,
  getChatMessages,
  getUserChats,
} from "../controllers/chat.controller.js";
import { checkTokenLimit } from "../middleware/checkTokenLimit.js";

const router = express.Router();

router.get("/", authMiddleware, getUserChats);
router.post("/", authMiddleware, createChat);
router.get("/:chatId", authMiddleware, getChatMessages);
router.post("/:chatId/ask", authMiddleware, checkTokenLimit, askQuestion);

export default router;
