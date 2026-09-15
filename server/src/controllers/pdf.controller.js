import { pool } from "../db/db.js";
import { processPdf } from "../services/pdf.service.js";

export async function uploadPdf(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF file",
      });
    }

    const userId = req.user.userId;

    const result = await processPdf(req.file, userId);

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to process PDF",
    });
  }
}

export async function getUserDocuments(req, res) {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `
        SELECT
          id,
          filename,
          file_url,
          created_at
        FROM documents
        WHERE user_id = $1
        ORDER BY created_at DESC
      `,
      [userId],
    );

    res.json({
      success: true,
      documents: result.rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch documents",
    });
  }
}

export async function getDocument(req, res) {
  try {
    const { documentId } = req.params;
    const userId = req.user.userId;

    const result = await pool.query(
      `
        SELECT
          id,
          filename,
          file_url,
          created_at
        FROM documents
        WHERE id = $1
          AND user_id = $2
      `,
      [documentId, userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    res.json({
      success: true,
      document: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch document",
    });
  }
}