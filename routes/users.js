import express from "express";
import {
  getAllUsers,
  getUserById,
  getCurrentUser,
  createUser,
  updateUser,
  deleteUser,
  login,
  logout,
} from "../controllers/userController.js";

import auth from "../middleware/auth.js";

const router = express.Router();

// 🔐 Авторизация
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

export default router;

