import { pool } from "../db/pool.js";

export const getDashboardStats = async (req, res) => {
  const merchantId = req.merchant.id;

  const totalTxResult = await pool.query(
    "SELECT COUNT(*)::int AS count FROM payments WHERE merchant_id = $1",
    [merchantId]
  );

  const successTxResult = await pool.query(
    "SELECT COUNT(*)::int AS count FROM payments WHERE merchant_id = $1 AND status = 'success'",
    [merchantId]
  );

  const totalAmountResult = await pool.query(
    `
    SELECT COALESCE(SUM(amount), 0)::int AS total_amount
    FROM payments
    WHERE merchant_id = $1 AND status = 'success'
    `,
    [merchantId]
  );

  const totalTransactions = totalTxResult.rows[0].count;
  const successfulTransactions = successTxResult.rows[0].count;
  const totalAmount = totalAmountResult.rows[0].total_amount;

  const successRate =
    totalTransactions === 0
      ? 0
      : Math.round((successfulTransactions / totalTransactions) * 100);

  return res.json({
    total_transactions: totalTransactions,
    total_amount: totalAmount,
    success_rate: successRate,
  });
};

export const getDashboardTransactions = async (req, res) => {
  const merchantId = req.merchant.id;

  const result = await pool.query(
    `
    SELECT id, order_id, amount, method, status, created_at
    FROM payments
    WHERE merchant_id = $1
    ORDER BY created_at DESC
    `,
    [merchantId]
  );

  return res.json({ transactions: result.rows });
};
