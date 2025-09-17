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

// root API — список доступных маршрутов
app.get("/api", (req, res) => {
  res.json({
    message: "Добро пожаловать в API дипломного проекта!",
    routes: {
      public: [
        { path: "/api/health", method: "GET", description: "Проверка работы сервера" },
        { path: "/api/products", method: "GET", description: "Получение всех продуктов" },
        { path: "/api/products/:id", method: "GET", description: "Получение продукта по ID" },
        { path: "/api/categories", method: "GET", description: "Получение всех категорий" }
      ],
      protected: [
        { path: "/api/users", method: "GET", description: "Список пользователей (требуется авторизация)" },
        { path: "/api/products", method: "POST", description: "Создание продукта (требуется авторизация)" },
        { path: "/api/products/:id", method: "PUT", description: "Редактирование продукта (требуется авторизация)" },
        { path: "/api/products/:id", method: "DELETE", description: "Удаление продукта (требуется авторизация)" }
      ]
    }
  });
});

// обработка неизвестных маршрутов
app.use((req, res) => {
  res.status(404).json({ message: "Маршрут не найден" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});

