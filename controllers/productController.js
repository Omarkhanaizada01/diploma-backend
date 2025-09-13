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
// Обновить продукт
exports.updateProduct = async (req, res) => {
  const id = Number(req.params.id);
  let data = req.body;

  try {
    // Если прислали imageUrl — сохраняем в image
    if (data.imageUrl) {
      data.image = data.imageUrl;
      delete data.imageUrl;
    }

    // Приведение типов (так как JSON в теле приходит строками)
    if (data.price !== undefined) data.price = parseFloat(data.price);
    if (data.oldPrice !== undefined) data.oldPrice = parseFloat(data.oldPrice);
    if (data.salePercent !== undefined) data.salePercent = parseInt(data.salePercent);
    if (data.categoryId !== undefined) data.categoryId = parseInt(data.categoryId);
    if (data.userId !== undefined) data.userId = parseInt(data.userId);

    if (data.inStock !== undefined) data.inStock = data.inStock === true || data.inStock === "true";
    if (data.isNew !== undefined) data.isNew = data.isNew === true || data.isNew === "true";
    if (data.isOnSale !== undefined) data.isOnSale = data.isOnSale === true || data.isOnSale === "true";
    if (data.isFeatured !== undefined) data.isFeatured = data.isFeatured === true || data.isFeatured === "true";
    if (data.isHotDeal !== undefined) data.isHotDeal = data.isHotDeal === true || data.isHotDeal === "true";
    if (data.isPopular !== undefined) data.isPopular = data.isPopular === true || data.isPopular === "true";

    const updated = await prisma.product.update({
      where: { id },
      data,
    });

    res.json(updated);
  } catch (error) {
    console.error("❌ Ошибка при обновлении:", error);
    res.status(400).json({ error: error.message, details: error }); 
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
