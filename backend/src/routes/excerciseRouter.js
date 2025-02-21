const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();

const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  try {
    let data = await prisma.exercises.findMany({
      where: {},
    });
    if (!data.length) {
      res.status(204).json({ message: "No Excercises found." });
    }
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ messaage: error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let data = await prisma.exercises.findUnique({
      where: {
        id: id,
      },
    });
    if (!data.length) {
      res.status(204).json({ message: "No Excercises found." });
    }
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ messaage: error });
  }
});

module.exports = router;
