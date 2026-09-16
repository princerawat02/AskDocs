import {pool} from "../db/db.js";

const MONTHLY_TOKEN_LIMIT =
  Number(process.env.MONTHLY_TOKEN_LIMIT) || 5000;

export const checkTokenLimit = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `
      SELECT total_tokens, period_start
      FROM user_usage
      WHERE user_id = $1
      `,
      [userId]
    );

    // No usage record yet → user hasn't used any tokens
    if (result.rows.length === 0) {
      return next();
    }

    const { total_tokens } = result.rows[0];

    if (Number(total_tokens) >= MONTHLY_TOKEN_LIMIT) {
      return res.status(429).json({
        success: false,
        message: "Monthly AI token limit reached.",
      });
    }

    next();
  } catch (error) {
    console.error("Token limit middleware error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify token usage.",
    });
  }
};