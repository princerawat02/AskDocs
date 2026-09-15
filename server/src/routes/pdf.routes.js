import express from "express";
import multer from "multer";

import {
  getDocument,
  getUserDocuments,
  uploadPdf,
} from "../controllers/pdf.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: "src/uploads/",
    filename: (req, file, cb) => {
      const filename = `${Date.now()}-${file.originalname}`;
      cb(null, filename);
    },
  }),

  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

router.get("/", authMiddleware, getUserDocuments);
router.get("/:documentId", authMiddleware, getDocument);
router.post("/upload", authMiddleware, upload.single("pdf"), uploadPdf);

export default router;
