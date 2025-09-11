// routes/user.js
const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  login,
  logout
} = require("../controllers/userController");

const auth = require("../middleware/auth");

// 🔐 Авторизация (логин)
router.post("/login", login);

// описываем все роуты
router.get("/", auth, getAllUsers);  
router.get("/:id", auth, getUserById);
router.post("/", createUser);
router.put("/:id", auth, updateUser);
router.delete("/:id", auth, deleteUser);

router.post("/logout", logout);

module.exports = router;