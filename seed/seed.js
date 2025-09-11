// backend/seed.js
const { execSync } = require("child_process");

async function runSeeds() {
  try {
    console.log("🚀 Запускаем сиды...");

    execSync("node seed/seedUsers.js", { stdio: "inherit" });
    execSync("node seed/seedCategories.js", { stdio: "inherit" });
    execSync("node seed/seedProducts.js", { stdio: "inherit" });

    console.log("✅ Все сиды успешно выполнены!");
  } catch (error) {
    console.error("❌ Ошибка при запуске сидов:", error.message);
    process.exit(1);
  }
}

runSeeds();
