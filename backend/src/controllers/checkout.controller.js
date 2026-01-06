import { pool } from "../db/pool.js";
import { createPayment } from "./payment.controller.js";

/**
 * GET /checkout/orders/:orderId
 * Public order fetch
 */
export const getCheckoutOrder = async (req, res) => {
  const { orderId } = req.params;

  const { rows } = await pool.query(
    `SELECT id, amount, currency, status
     FROM orders
     WHERE id = $1`,
    [orderId]
  );

  if (rows.length === 0) {
    return res.status(404).json({
      error: {
        code: "NOT_FOUND_ERROR",
        description: "Order not found",
      },
    });
  }

  return res.status(200).json(rows[0]);
};

/**
 * POST /checkout/payments
 * Public payment creation
 */
export const createCheckoutPayment = async (req, res) => {
  const { order_id } = req.body;

  // 1️⃣ Find merchant from order
  const { rows } = await pool.query(
    `SELECT merchant_id FROM orders WHERE id = $1`,
    [order_id]
  );

  if (rows.length === 0) {
    return res.status(404).json({
      error: {
        code: "NOT_FOUND_ERROR",
        description: "Order not found",
      },
    });
  }

  // 2️⃣ Inject merchant context manually
  req.merchant = {
    id: rows[0].merchant_id,
  };

  // 3️⃣ Reuse existing payment logic
  return createPayment(req, res);
};
