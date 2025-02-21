const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();

const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  try {
    const data = await prisma.exercises.findMany();

    if (!data.length) {
      return res.status(204).json({ message: "No Exercises found." });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const data = await prisma.exercises.findUnique({
      where: { id },
    });

    if (!data) {
      return res.status(404).json({ message: "Exercise not found." });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

module.exports = router;
