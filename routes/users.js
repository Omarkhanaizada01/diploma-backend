// routes/user.js
const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  getCurrentUser,
  createUser,
  updateUser,
  deleteUser,
  login,
  logout,
} = require("../controllers/userController");

const auth = require("../middleware/auth");

// 🔐 Авторизация (логин/логаут)
router.post("/login", login);
router.post("/logout", logout);

// 🔐 Текущий пользователь
router.get("/me", auth, getCurrentUser);

// 👥 Пользователи
router.get("/", auth, getAllUsers);
router.get("/:id", auth, getUserById);
router.post("/", createUser);
router.put("/:id", auth, updateUser);
router.delete("/:id", auth, deleteUser);

module.exports = router;
