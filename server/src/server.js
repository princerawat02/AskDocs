import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from 'cookie-parser'
import path from 'path'

import { pool } from "./db/db.js";
import pdfRoutes from "./routes/pdf.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { searchSimilarChunks } from "./services/rag.service.js";
import { fileURLToPath } from "url";

const app = express();

const PORT = process.env.PORT || 5000;

//CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
//Middlewares
app.use(express.json());
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
  });
});

//routes
app.use("/api/pdf", pdfRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/auth", authRoutes);

app.get("/test", async (req, res) => {
  const results = await searchSimilarChunks(
    "what is agents.md what should i add here?",
    "7fa22f4e-d8d4-4a13-b3e4-e17354aa4047",
  );

  res.json({
    results,
  });
});

async function testDB() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("Database connected:", result.rows[0]);
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

app.listen(PORT, () => {
  testDB();

  console.log(`Server running on http://localhost:${PORT}`);
});
