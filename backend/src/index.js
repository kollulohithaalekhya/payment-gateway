import express from "express";
import { env } from "./config/env.js";
import healthRoutes from "./routes/health.routes.js";
import { authenticateMerchant } from "./middleware/auth.middleware.js";
import orderRoutes from "./routes/order.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import checkoutRoutes from "./routes/checkout.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import cors from "cors";

const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000", // dashboard (nginx/react)
    "http://localhost:5173", // vite dev (optional)
    "http://localhost:3001"  // checkout
  ],
  allowedHeaders: [
    "Content-Type",
    "X-Api-Key",
    "X-Api-Secret"
  ],
  methods: ["GET", "POST", "OPTIONS"]
}));

app.use(express.json());

// Public
app.use(healthRoutes);
app.use(checkoutRoutes);
// Auth required below
app.use(authenticateMerchant);
app.use(dashboardRoutes);

// Orders
app.use(orderRoutes);
app.use(paymentRoutes);

app.listen(env.PORT, () => {
  console.log(`API running on port ${env.PORT}`);
});
