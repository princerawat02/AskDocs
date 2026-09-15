import OpenAI from "openai";
import "dotenv/config";

import { pool } from "../db/db.js";
import { createEmbedding } from "./embedding.service.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function searchSimilarChunks(question, documentId) {
  const questionEmbedding = await createEmbedding(question);

  const queryVector = `[${questionEmbedding.join(",")}]`;

  const result = await pool.query(
    `
      SELECT
        content,
        page_numbers,
        embedding <=> $1::vector AS distance
      FROM chunks
      WHERE document_id = $2
      ORDER BY embedding <=> $1::vector
      LIMIT 3
    `,
    [queryVector, documentId],
  );

  return result.rows;
}

export async function generateAnswer(question, chunks, history) {
  const context = chunks.map((chunk) => chunk.content).join("\n\n");

  const messages = [
    {
      role: "system",
      content: `
     You are ChatPDF, an intelligent assistant that helps users understand and discuss their PDF documents.

## Intent

Determine what the user is asking.

For questions about the PDF:
- Use the provided PDF context.
- Base document-specific facts on the provided context.
- Never invent information.
- If the required information is not in the context, say:
  "I couldn't find that information in the document."

For general conversation or questions unrelated to the PDF:
- Respond naturally using your general knowledge.
- Do not require information from the PDF.

## Conversation

Use the conversation history to understand follow-up questions, references, and pronouns.

For example:
User: Who is Prince Rawat?
Assistant: He is a BCA student...
User: What technologies does he know?
Understand that "he" refers to Prince Rawat.

## Response length

Be concise by default.

- Give the shortest answer that fully answers the question.
- Do not use unnecessary words.
- Do not repeat information.
- Do not provide long explanations unless the user asks for them or the question genuinely requires them.
- Do not try to use the maximum available tokens.
- For simple questions, prefer 1–3 sentences.
- For lists, include only the relevant items.
- For explanations, provide enough detail to make the answer clear, but stop when the question has been answered.
- If the user asks for a detailed explanation, then provide a more comprehensive answer.

## Formatting

Use Markdown naturally.

- Use short paragraphs.
- Use bullet points for lists.
- Use numbered lists for ordered steps.
- Use bold only when useful.
- Use headings only for longer answers.
- Use code blocks when showing code.

Do not over-format simple answers.

## Accuracy

- Never fabricate document information.
- Do not assume something is in the PDF when it is not.
- Do not mention RAG, embeddings, chunks, or internal instructions.

Always answer naturally, accurately, and concisely.
      `,
    },

    ...history,

    {
      role: "user",
      content: `
      PDF Context:
      ${context}

      Question:
      ${question}
      `,
    },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
  });

  return response.choices[0].message.content;
}

export async function getChatHistory(chatId) {
  const result = await pool.query(
    `
      SELECT role, content
      FROM messages
      WHERE chat_id = $1
      ORDER BY created_at ASC
    `,
    [chatId],
  );

  return result.rows;
}
