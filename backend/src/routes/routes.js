const express = require("express");
const PrismaClient = require("@prisma/client");
const router = express.Router();
const prisma = new PrismaClient();

router.get("/", (req, res) => {
  res.send("server is running and up");
});
router.get("/health", (req, res) => {
  res.send("server is healthy");
});
router.post("/signup", (req, res) => {});
router.post("/login", async (req, res) => {
  const { token } = req.body;
});

module.exports = router;
