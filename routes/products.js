const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

// Все могут просматривать
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Только админ может изменять
router.post("/", auth, isAdmin, createProduct);
router.put("/:id", auth, isAdmin, updateProduct);
router.delete("/:id", auth, isAdmin, deleteProduct);

module.exports = router;
