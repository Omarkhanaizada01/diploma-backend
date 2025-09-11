// backend/seed/seedCategories.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const categories = [
  { name: "Fresh Fruit", isPopular: true },
  { name: "Fresh Vegetables", isPopular: true },
  { name: "Meat & Fish", isPopular: true },
  { name: "Snacks", isPopular: true },
  { name: "Beverages", isPopular: true },
  { name: "Beauty & Health", isPopular: true },
  { name: "Bread & Bakery", isPopular: true },
  { name: "Baking Needs", isPopular: true },
  { name: "Cooking", isPopular: true },
  { name: "Diabetic Food", isPopular: true },
  { name: "Dish Detergents", isPopular: true },
  { name: "Oil", isPopular: true }
];

async function main() {
  console.log("\ud83c\udf31 Сеем категории...");
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  for (const category of categories) {
    await prisma.category.create({ data: category });
  }

  console.log("\u2705 Категории успешно добавлены!");
}

main()
  .catch((e) => {
    console.error("\u274c Ошибка при создании категорий:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
