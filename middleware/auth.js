import jwt from "jsonwebtoken";

// middleware auth Authorization токен через cookie 
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token; // токен из cookie

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

export default authMiddleware;

