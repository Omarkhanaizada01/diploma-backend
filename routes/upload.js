// backend/routes/upload.js
const express = require("express");
const upload = require("../middleware/upload");

const router = express.Router();

router.post("/", upload.single("image"), (req, res) => {
  try {
    console.log("📂 Файл от клиента:", req.file); // 👈 лог
    if (!req.file) {
      return res.status(400).json({ message: "Файл не получен" });
    }

    res.json({
      imageUrl: req.file.path, // Cloudinary URL
    });
  } catch (error) {
    console.error("❌ Ошибка загрузки:", error);
    res.status(500).json({ message: "Ошибка загрузки изображения" });
  }
});

module.exports = router;
