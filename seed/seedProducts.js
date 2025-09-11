// backend/seed/seedProducts.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Сеем продукты...");

  // очищаем таблицу
  await prisma.product.deleteMany();

  // берём категории из базы
  const categories = await prisma.category.findMany();
  const getCat = (name) => categories.find((c) => c.name === name)?.id;

  const userId = 1;

  await prisma.product.createMany({
    data: [
      { title: "Green Apple", description: "Fresh green apples", image: "https://example.com/green-apple.jpg", price: 2.99, oldPrice: 5.99, salePercent: 50, isPopular: true, isFeatured: true, isOnSale: true, isHotDeal: false, inStock: true, categoryId: getCat("Fresh Fruit"), userId },
      { title: "Fresh Indian Malta", description: "Sweet Indian Malta", image: "https://example.com/malta.jpg", price: 3.5, isPopular: true, isFeatured: true, isOnSale: false, isHotDeal: false, inStock: true, categoryId: getCat("Fresh Fruit"), userId },
      { title: "Chinese Cabbage", description: "Crisp cabbage", image: "https://example.com/cabbage.jpg", price: 1.99, oldPrice: 3.99, salePercent: 50, isPopular: true, isFeatured: true, isOnSale: true, isHotDeal: true, inStock: true, categoryId: getCat("Fresh Vegetables"), userId },
      { title: "Green Lettuce", description: "Fresh green lettuce", image: "https://example.com/lettuce.jpg", price: 1.5, isPopular: true, isFeatured: true, isHotDeal: true, inStock: true, categoryId: getCat("Fresh Vegetables"), userId },
      { title: "Eggplant", description: "Organic eggplants", image: "https://example.com/eggplant.jpg", price: 1.5, isPopular: true, isHotDeal: true, inStock: true, categoryId: getCat("Fresh Vegetables"), userId },
      { title: "Big Potatoes", description: "Large fresh potatoes", image: "https://example.com/potatoes.jpg", price: 1.2, isPopular: true, isHotDeal: true, inStock: true, categoryId: getCat("Fresh Vegetables"), userId },
      { title: "Corn", description: "Sweet corn", image: "https://example.com/corn.jpg", price: 1.2, isHotDeal: true, inStock: true, categoryId: getCat("Fresh Vegetables"), userId },
      { title: "Fresh Cauliflower", description: "Organic cauliflower", image: "https://example.com/cauliflower.jpg", price: 1.4, isHotDeal: true, inStock: true, categoryId: getCat("Fresh Vegetables"), userId },
      { title: "Green Capsicum", description: "Fresh capsicum", image: "https://example.com/capsicum.jpg", price: 1.6, oldPrice: 3.2, salePercent: 50, isHotDeal: true, isOnSale: true, inStock: true, categoryId: getCat("Fresh Vegetables"), userId },
      { title: "Green Chili", description: "Hot green chili", image: "https://example.com/green-chili.jpg", price: 0.9, isHotDeal: true, inStock: true, categoryId: getCat("Fresh Vegetables"), userId },
      { title: "Spinach", description: "Organic spinach", image: "https://example.com/spinach.jpg", price: 1.1, isHotDeal: true, inStock: true, categoryId: getCat("Fresh Vegetables"), userId },
      { title: "Red Chili", description: "Spicy red chili", image: "https://example.com/red-chili.jpg", price: 1.0, isHotDeal: true, inStock: true, categoryId: getCat("Fresh Vegetables"), userId },
      { title: "Red Tomatoes", description: "Juicy tomatoes", image: "https://example.com/tomatoes.jpg", price: 1.3, oldPrice: 2.6, salePercent: 50, isOnSale: true, isHotDeal: true, inStock: true, categoryId: getCat("Fresh Vegetables"), userId },
      { title: "Surjapur Mango", description: "Delicious mangoes", image: "https://example.com/mango.jpg", price: 2.7, isHotDeal: true, inStock: true, categoryId: getCat("Fresh Fruit"), userId }
    ]
  });

  console.log("✅ Продукты успешно добавлены!");
}

main()
  .catch((e) => {
    console.error("❌ Ошибка при создании продуктов:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
