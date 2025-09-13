// middleware/isAdmin.js
module.exports = (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Неавторизован" });
    }
  
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Нет прав доступа" });
    }
  
    next();
  };
  