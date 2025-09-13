// controllers/userController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Получить всех пользователей
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Ошибка при получении пользователей" });
  }
};

// Получить одного пользователя по ID
exports.getUserById = async (req, res) => {
  const id = Number(req.params.id);
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true },
    });
    if (!user) return res.status(404).json({ error: "Не найден" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Ошибка при получении пользователя" });
  }
};

// Получить текущего пользователя по JWT
exports.getCurrentUser = async (req, res) => {
  try {
    const { id } = req.user; // req.user создаётся в middleware/auth.js
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true },
    });
    if (!user) return res.status(404).json({ message: "Пользователь не найден" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении текущего пользователя" });
  }
};

// Создать пользователя (с хэшированием пароля)
exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: "Такой email уже зарегистрирован" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { name, email, password: passwordHash, role: "USER" },
    });

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Ошибка при создании пользователя" });
  }
};

// Обновить пользователя
exports.updateUser = async (req, res) => {
  const id = Number(req.params.id);
  const { name, email, password } = req.body;

  try {
    const dataToUpdate = { name, email };
    if (password) {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
    });

    const { password: _, ...userWithoutPassword } = updatedUser;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(404).json({ error: "Ошибка при обновлении пользователя" });
  }
};

// Удалить пользователя
exports.deleteUser = async (req, res) => {
  const id = Number(req.params.id);
  try {
    const deletedUser = await prisma.user.delete({ where: { id } });
    res.json({ message: "Пользователь удалён", deletedUser });
  } catch (error) {
    res.status(404).json({ error: "Ошибка при удалении пользователя" });
  }
};

// Логин с установкой токена в cookie
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Пользователь не найден" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Неверный пароль" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // ✅ фикс для Vercel + Render
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({ message: "Вы вошли успешно" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка авторизации" });
  }
};

// Логаут
exports.logout = (req, res) => {
  res.clearCookie("token").json({ message: "Вы вышли из системы" });
};
