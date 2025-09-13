const express = require("express");
const cors = require("./middleware/cors"); // теперь это функция
const cookieParser = require("cookie-parser");
const path = require("path");

const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/products");
const userRoutes = require("./routes/users");
const uploadRoutes = require("./routes/upload"); // файл upload.js

const app = express();

// middleware
app.use(cors()); // ✅ вызываем функцию
app.use(express.json());
app.use(cookieParser());



// ✅ подключаем все роуты с префиксом /api
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
