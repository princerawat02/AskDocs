import OpenAI from "openai";
import "dotenv/config";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateSampleQuestions(text) {
  const response = await openai.responses.create({
    model: "gpt-5-mini",
    input: `
Read the following document and generate 4 simple questions
that a user might naturally ask about it.

Rules:
- Keep questions short and simple.
- One topic per question.
- Avoid combining multiple questions with "and".
- Use natural everyday language.
- Questions should be answerable from the document.
- Prefer questions about important facts, topics, projects, people,
  dates, technologies, conclusions, or key information.
- Avoid overly specific or complicated questions.
- Each question should ideally be under 10 words.
- Return ONLY a JSON array of 4 question strings.

Examples of good questions:
"What is this document about?"
"What technologies were used?"
"When did he graduate?"
"What is the AskDocs project?"
"What databases were used?"
"What is the main conclusion?"

Document:
${text.slice(0, 20000)}`
,});

return JSON.parse(response.output_text);
}
