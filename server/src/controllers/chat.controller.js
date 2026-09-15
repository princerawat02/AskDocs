import { pool } from "../db/db.js";
import { v4 as uuidv4 } from "uuid";
import {
  generateAnswer,
  getChatHistory,
  searchSimilarChunks,
} from "../services/rag.service.js";

export async function createChat(req, res) {
  try {
    const { documentId } = req.body;
    const userId = req.user.userId;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        message: "documentId is required",
      });
    }

    // Make sure this document belongs to the logged-in user
    const documentResult = await pool.query(
      `
        SELECT id
        FROM documents
        WHERE id = $1
          AND user_id = $2
      `,
      [documentId, userId],
    );

    if (documentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    const chatId = uuidv4();

    await pool.query(
      `
        INSERT INTO chats (
          id,
          user_id,
          document_id
        )
        VALUES ($1, $2, $3)
      `,
      [chatId, userId, documentId],
    );

    res.status(201).json({
      success: true,
      chat: {
        id: chatId,
        documentId,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create chat",
    });
  }
}

export async function getUserChats(req, res) {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `
        SELECT
          c.id,
          c.document_id,
          d.filename,
          c.created_at
        FROM chats c
        JOIN documents d
          ON c.document_id = d.id
        WHERE c.user_id = $1
        ORDER BY c.created_at DESC
      `,
      [userId],
    );

    res.json({
      success: true,
      chats: result.rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch chats",
    });
  }
}

export async function getChatMessages(req, res) {
  try {
    const { chatId } = req.params;
    const userId = req.user.userId;

    const result = await pool.query(
      `
        SELECT
          m.id,
          m.role,
          m.content,
          m.created_at
        FROM messages m
        JOIN chats c
          ON m.chat_id = c.id
        WHERE m.chat_id = $1
          AND c.user_id = $2
        ORDER BY m.created_at ASC
      `,
      [chatId, userId],
    );

    res.json({
      success: true,
      messages: result.rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch chat messages",
    });
  }
}

export async function askQuestion(req, res) {
  try {
    const { chatId } = req.params;
    const { question } = req.body;

    const userId = req.user.userId;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    // 1. Verify chat belongs to the logged-in user
    const chatResult = await pool.query(
      `
        SELECT id, document_id
        FROM chats
        WHERE id = $1
        AND user_id = $2
      `,
      [chatId, userId],
    );

    if (chatResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    const documentId = chatResult.rows[0].document_id;

    // 2. Save user's message
    await pool.query(
      `
        INSERT INTO messages (
          id,
          chat_id,
          role,
          content
        )
        VALUES ($1, $2, $3, $4)
      `,
      [uuidv4(), chatId, "user", question],
    );

    // get older chat history
    const history = await getChatHistory(chatId);

    // 3. Find relevant PDF chunks
    const chunks = await searchSimilarChunks(question, documentId);

    // 4. Generate AI answer
    const answer = await generateAnswer(question, chunks, history);

    const sources = [...new Set(chunks.flatMap((chunk) => chunk.page_numbers))];

    // 5. Save AI message
    await pool.query(
      `
        INSERT INTO messages (
          id,
          chat_id,
          role,
          content
        )
        VALUES ($1, $2, $3, $4)
      `,
      [uuidv4(), chatId, "assistant", answer],
    );

    // 6. Return answer
    res.json({
      success: true,
      answer,
      sources,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to answer question",
    });
  }
}
