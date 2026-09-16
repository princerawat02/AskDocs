import { pool } from "../db/db.js";

export async function getTokenLimitStatus(req, res) {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `
      SELECT total_tokens
      FROM user_usage
      WHERE user_id = $1
      `,
      [userId],
    );

    const totalTokens =
      result.rows.length > 0 ? Number(result.rows[0].total_tokens) : 0;

    const limit = Number(process.env.MONTHLY_TOKEN_LIMIT) || 5000;

    const reachedLimit = totalTokens >= limit;

    return res.json({
      success: true,
      reachedLimit,
      totalTokens,
      limit,
      remainingTokens: Math.max(limit - totalTokens, 0),
    });
  } catch (error) {
    console.error("Token limit status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to check token limit",
    });
  }
}
