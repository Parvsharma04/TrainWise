const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const router = express.Router();
const prisma = new PrismaClient();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
router.get("/health", (req, res) => {
  res.send("Server is healthy");
});

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(req.body);

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user with related tables
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        user_details: {
          create: {},
        },
        user_badges: {
          create: {},
        },
      },
    });

    // Get all available exercises to add to user_exercises
    const exercises = await prisma.exercises.findMany();

    // Create default exercise entries for the user
    if (exercises.length > 0) {
      await prisma.user_exercises.createMany({
        data: exercises.map((exercise) => ({
          userId: newUser.id,
          exerciseId: exercise.id,
          progress: 0,
          completed: false,
        })),
      });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ message: "User created successfully", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
