const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("server is running and up");
});
router.get("/health", (res, res) => {
  res.send("server is healthy");
});
router.post("/signup", (req, res) => {});
router.post("/login", (req, res) => {});

module.exports = router;
