// middleware/auth.js

const jwt = require("jsonwebtoken");

// middleware auth Authorization токен через cookie 
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token; // Получаем токен из cookie

  if (!token) {
    return res.status(401).json({ message: "Нет токена" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Неверный токен" });
  }
};

module.exports = authMiddleware;
