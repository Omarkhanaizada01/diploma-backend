const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Хранилище для файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads")); // uploads в корне backend
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, filename);
  }
});

const upload = multer({ storage });

// POST /api/upload
router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Отдаём путь, который фронт сможет использовать
  const url = `/uploads/${req.file.filename}`;
  res.json({ url });
});

module.exports = router;
