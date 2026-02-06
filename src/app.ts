import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import categoryRoutes from "./routes/category.routes";
import productRoutes from "./routes/product.routes";
import transactionRoutes from "./routes/transaction.routes";
import bankRoutes from "./routes/bank.routes";
import { authenticate } from "./middlewares/auth.middleware";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/banks", bankRoutes);
app.use("/api/transactions", transactionRoutes);

app.get("/", (req, res) => {
  res.send("Sporton Backend API is Running");
});

app.get("/test-middleware", authenticate, (req, res) => {
  res.send("Hore, kamu bisa mengaksesnya karena kamu pakai token!");
});

export default app;
