import fs from "fs";
import { PDFParse } from "pdf-parse";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { supabase } from "../db/supabase.js";

import { pool } from "../db/db.js";
import { chunkPages } from "../utils/chunkText.js";
import { createEmbedding } from "./embedding.service.js";

export async function processPdf(file, userId) {
  if (!file) {
    throw new Error("No PDF file uploaded");
  }

  const client = await pool.connect();

  try {
    // 1. Read PDF
    const dataBuffer = fs.readFileSync(file.path);

    // 2. Extract text
    const parser = new PDFParse({
      data: dataBuffer,
    });

    const data = await parser.getText();

    await parser.destroy();

    // 3. Check PDF content
    const text = data.text?.replace(/\s+/g, " ").trim();

    if (!text || text.length < 50) {
      throw new Error(
        "PDF contains insufficient readable text. Scanned/image-only PDFs are not supported.",
      );
    }

    // 4. Create chunks
    const chunks = chunkPages(data.pages, 500, 100);

    // 5. Upload PDF to Supabase Storage
    const storagePath = `${userId}/${uuidv4()}-${file.originalname}`;

    const { error: uploadError } = await supabase.storage
      .from("pdfs")
      .upload(storagePath, dataBuffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    // 6. Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("pdfs")
      .getPublicUrl(storagePath);

    const fileUrl = publicUrlData.publicUrl;

    // Start transaction
    await client.query("BEGIN");

    // 7. Create document
    const documentId = uuidv4();

    await client.query(
      `
        INSERT INTO documents (
          id,
          user_id,
          filename,
          file_url
        )
        VALUES ($1, $2, $3, $4)
      `,
      [documentId, userId, file.originalname, fileUrl],
    );

    // 8. Create embeddings + save chunks
    for (const chunk of chunks) {
      const embedding = await createEmbedding(chunk.content);

      const vector = `[${embedding.join(",")}]`;

      await client.query(
        `
          INSERT INTO chunks (
            id,
            document_id,
            content,
            embedding,
            page_numbers
          )
          VALUES ($1, $2, $3, $4, $5)
        `,
        [uuidv4(), documentId, chunk.content, vector, chunk.pageNumbers],
      );
    }

    // 9. Everything succeeded
    await client.query("COMMIT");

    // 10. Delete temporary local PDF
    if (file?.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    return {
      documentId,
      filename: file.originalname,
      chunks: chunks.length,
    };
  } catch (error) {
    await client.query("ROLLBACK");

    throw error;
  } finally {
    client.release();
  }
}
