const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// const auth = require("../middleware/auth"); // 🔒 В будущем включи защиту

router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Временно без защиты:
router.post("/", createProduct);
// В будущем:
// router.post("/", auth, createProduct);

router.put("/:id", updateProduct);
// router.put("/:id", auth, updateProduct);

router.delete("/:id", deleteProduct);
// router.delete("/:id", auth, deleteProduct);

module.exports = router;
