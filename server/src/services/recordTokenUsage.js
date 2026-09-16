import {pool} from "../db/db.js"

const MONTHLY_TOKEN_LIMIT =
  Number(process.env.MONTHLY_TOKEN_LIMIT) || 10000;

export async function recordTokenUsage(userId, usage) {
  const { inputTokens, outputTokens, totalTokens } = usage;

  const result = await pool.query(
    `
    INSERT INTO user_usage (
      user_id,
      input_tokens,
      output_tokens,
      total_tokens
    )
    VALUES ($1, $2, $3, $4)

    ON CONFLICT (user_id)
    DO UPDATE SET
      input_tokens = user_usage.input_tokens + EXCLUDED.input_tokens,
      output_tokens = user_usage.output_tokens + EXCLUDED.output_tokens,
      total_tokens = user_usage.total_tokens + EXCLUDED.total_tokens

    RETURNING total_tokens
    `,
    [userId, inputTokens, outputTokens, totalTokens]
  );

  const newTotal = Number(result.rows[0].total_tokens);

  return {
    totalTokens: newTotal,
    limit: MONTHLY_TOKEN_LIMIT,
    remainingTokens: Math.max(
      MONTHLY_TOKEN_LIMIT - newTotal,
      0
    ),
  };
}