// backend/controllers/productController.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllProducts = async (req, res) => {
  try {
    const {
      categoryId,
      sortBy,
      minPrice,
      maxPrice,
      page = 1,
      limit = 9,
    } = req.query;

    const where = {};

    if (categoryId) where.categoryId = Number(categoryId);

    // Фильтр по цене
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = parseFloat(minPrice);
      if (maxPrice !== undefined) where.price.lte = parseFloat(maxPrice);
    }

    // Сортировка
    let orderBy = { id: "desc" };
    if (sortBy === "price_desc") orderBy = { price: "desc" };
    if (sortBy === "price_asc") orderBy = { price: "asc" };
    if (sortBy === "latest") orderBy = { id: "desc" };

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.max(1, parseInt(limit, 10) || 9);
    const skip = (pageNum - 1) * pageSize;

    const total = await prisma.product.count({ where });

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy,
      skip,
      take: pageSize,
    });

    res.json({ products, total });
  } catch (error) {
    console.error("Ошибка при получении продуктов:", error);
    res.status(500).json({ error: "Ошибка при получении продуктов" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: { category: true },
    });

    if (!product) {
      return res.status(404).json({ error: "Продукт не найден" });
    }

    res.json(product);
  } catch (error) {
    console.error("Ошибка при получении продукта:", error);
    res.status(500).json({ error: "Ошибка при получении продукта" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, price, description, image, categoryId, stock } = req.body;
    
    const product = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        description,
        image,
        categoryId: Number(categoryId),
        stock: stock ? parseInt(stock) : 0,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Ошибка при создании продукта:", error);
    res.status(500).json({ error: "Ошибка при создании продукта" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, image, categoryId, stock } = req.body;

    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name,
        price: price ? parseFloat(price) : undefined,
        description,
        image,
        categoryId: categoryId ? Number(categoryId) : undefined,
        stock: stock ? parseInt(stock) : undefined,
      },
    });

    res.json(product);
  } catch (error) {
    console.error("Ошибка при обновлении продукта:", error);
    res.status(500).json({ error: "Ошибка при обновлении продукта" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Ошибка при удалении продукта:", error);
    res.status(500).json({ error: "Ошибка при удалении продукта" });
  }
};



