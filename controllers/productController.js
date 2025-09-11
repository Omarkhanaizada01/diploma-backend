const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Получить все продукты
exports.getAllProducts = async (req, res) => {
  try {
    const { categoryId } = req.query;
    const where = {};
    if (categoryId) where.categoryId = Number(categoryId);

    const products = await prisma.product.findMany({
      where,
      include: { category: true }
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка при получении продуктов" });
  }
};

// Получить продукт по ID
exports.getProductById = async (req, res) => {
  const id = Number(req.params.id);
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product) return res.status(404).json({ error: "Продукт не найден" });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка при получении продукта" });
  }
};

// Создать продукт
exports.createProduct = async (req, res) => {
  const {
    title,
    description,
    image,
    price,
    categoryId,
    inStock,
    isNew,
    isOnSale,
    salePercent,
  } = req.body;

  try {
    const product = await prisma.product.create({
      data: {
        title,
        description,
        image,
        price: parseFloat(price),
        categoryId: parseInt(categoryId),
        inStock,
        isNew,
        isOnSale,
        salePercent: salePercent ? parseInt(salePercent) : null,
        userId: 1, // 🧪 Временно жестко указали пользователя (в будущем брать из токена)
      },
    });
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Ошибка при создании продукта" });
  }
};

// Обновить продукт
exports.updateProduct = async (req, res) => {
  const id = Number(req.params.id);
  const data = req.body;

  try {
    const updated = await prisma.product.update({
      where: { id },
      data,
    });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Ошибка при обновлении продукта" });
  }
};

// Удалить продукт
exports.deleteProduct = async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.product.delete({ where: { id } });
    res.json({ message: "Продукт удален" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Ошибка при удалении продукта" });
  }
};
