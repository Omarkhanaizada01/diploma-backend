// middleware/cors.js
const cors = require("cors");

const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:3000", // по умолчанию локалка
  credentials: true, // чтобы cookie (JWT) работали
};

module.exports = cors(corsOptions);
