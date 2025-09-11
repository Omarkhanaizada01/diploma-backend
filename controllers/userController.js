// controllers/userController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Получить всех пользователей
exports.getAllUsers = async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
};

// Получить одного пользователя по ID
exports.getUserById = async (req, res) => {
  const id = Number(req.params.id);
  const user = await prisma.user.findUnique({ where: { id } });
  user ? res.json(user) : res.status(404).json({ error: "Не найден" });
};

// Создать пользователя с хешированием пароля
exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const passwordHash = await bcrypt.hash(password, 10); // 10 — saltRounds

    const newUser = await prisma.user.create({
      data: { name, email, password: passwordHash },
    });

    // Чтобы не отправлять пароль клиенту:
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Ошибка при создании" });
  }
};

// Создать пользователя без хэширования пароля
// exports.createUser = async (req, res) => {
//   const { name, email } = req.body;
//   try {
//     const newUser = await prisma.user.create({ data: { name, email } });
//     res.status(201).json(newUser);
//   } catch (error) {
//     res.status(400).json({ error: "Ошибка при создании" });
//   }
// };

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
    console.error(error);
    res.status(404).json({ error: "Ошибка при обновлении" });
  }
};

// Обновить пользователя без хэширования пароля
// exports.updateUser = async (req, res) => {
//   const id = Number(req.params.id);
//   const { name, email } = req.body;
//   try {
//     const updatedUser = await prisma.user.update({
//       where: { id },
//       data: { name, email },
//     });
//     res.json(updatedUser);
//   } catch (error) {
//     res.status(404).json({ error: "Ошибка при обновлении" });
//   }
// };

// Удалить пользователя
exports.deleteUser = async (req, res) => {
  const id = Number(req.params.id);
  try {
    const deletedUser = await prisma.user.delete({ where: { id } });
    res.json({ message: "Пользователь удалён", deletedUser });
  } catch (error) {
    res.status(404).json({ error: "Ошибка при удалении" });
  }
};

// login и хранение token без cookie
// exports.login = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await prisma.user.findUnique({ where: { email } });

//     if (!user)
//       return res.status(400).json({ message: "Пользователь не найден" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: "Неверный пароль" });

//     const token = jwt.sign(
//       { id: user.id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: process.env.JWT_EXPIRES_IN }
//     );

//     res.json({ token });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Ошибка авторизации" });
//   }
// };

// login и хранение token в cookie
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(400).json({ message: "Пользователь не найден" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Неверный пароль" });

    // ✅ Создаём JWT токен
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // ✅ Отправляем токен в httpOnly cookie
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // https only в проде
        sameSite: "Strict", // можно "Lax" или "None" (если нужен cross-site)
        maxAge: 24 * 60 * 60 * 1000, // 1 день
      })
      .json({ message: "Вы вошли успешно" }); // Не отправляем токен явно!
  } catch (error) {
    res.status(500).json({ message: "Ошибка авторизации" });
  }
};

// logout
exports.logout = (req, res) => {
  res.clearCookie("token").json({ message: "Вы вышли из системы" });
};
