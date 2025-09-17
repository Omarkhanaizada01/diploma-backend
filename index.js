import express from "express";
import corsMiddleware from "./middleware/cors.js"; 
import cookieParser from "cookie-parser";

import categoryRoutes from "./routes/category.js";
import productRoutes from "./routes/products.js";
import userRoutes from "./routes/users.js";
import uploadRoutes from "./routes/upload.js";

const app = express();

// middleware
app.use(corsMiddleware); // ✅ без ()
app.use(express.json());
app.use(cookieParser());

// подключаем роуты с префиксом /api
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);

// health-check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// обработка неизвестных маршрутов
app.use((req, res) => {
  res.status(404).json({ message: "Маршрут не найден" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});

