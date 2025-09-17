import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Получить все категории
export const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: { products: true },
    });
    res.json(categories);
  } catch (error) {
    console.error("❌ Ошибка при получении категорий:", error);
    res.status(500).json({ error: error.message || "Ошибка при получении категорий" });
  }
};

// Получить категорию по ID
export const getCategoryById = async (req, res) => {
  const id = Number(req.params.id);
  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });
    if (!category) {
      return res.status(404).json({ error: "Категория не найдена" });
    }
    res.json(category);
  } catch (error) {
    console.error("❌ Ошибка при получении категории:", error);
    res.status(500).json({ error: error.message || "Ошибка при получении категории" });
  }
};

// Создать категорию
export const createCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const category = await prisma.category.create({ data: { name } });
    res.status(201).json(category);
  } catch (error) {
    console.error("❌ Ошибка при создании категории:", error);
    res.status(400).json({ error: error.message || "Ошибка при создании категории" });
  }
};

// Обновить категорию
export const updateCategory = async (req, res) => {
  const id = Number(req.params.id);
  const { name } = req.body;
  try {
    const updated = await prisma.category.update({
      where: { id },
      data: { name },
    });
    res.json(updated);
  } catch (error) {
    console.error("❌ Ошибка при обновлении категории:", error);
    res.status(400).json({ error: error.message || "Ошибка при обновлении категории" });
  }
};

// Удалить категорию
export const deleteCategory = async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.category.delete({ where: { id } });
    res.json({ message: "Категория удалена" });
  } catch (error) {
    console.error("❌ Ошибка при удалении категории:", error);
    res.status(400).json({ error: error.message || "Ошибка при удалении категории" });
  }
};

