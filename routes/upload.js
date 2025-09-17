import express from "express";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/", upload.single("image"), (req, res) => {
  try {
    console.log("📂 Файл от клиента:", req.file);
    if (!req.file) {
      return res.status(400).json({ message: "Файл не получен" });
    }

    res.json({
      imageUrl: req.file.path, 
    });
  } catch (error) {
    console.error("❌ Ошибка загрузки:", error);
    res.status(500).json({ message: "Ошибка загрузки изображения" });
  }
});

export default router;
