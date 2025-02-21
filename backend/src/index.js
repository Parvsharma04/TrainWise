const express = require("express");
const http = require("http");
const router = require("./routes/userRouter.js");
const initializeSocket = require("./connections/socket.js");
const excerciseRouter = require("./routes/excerciseRouter.js");
const userRouter = require("./routes/userRouter.js");
require("dotenv").config();
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const app = express();
const server = http.createServer(app);
const port = process.env.PORT;

app.use(cors());
app.use(router);

app.use("/user", userRouter);
app.use("/v1", excerciseRouter);
app.use(express.json());

app.post("/api/pushups", async (req, res) => {
  try {
    const { userId, exerciseName, reps, timeInSec } = req.body;
    console.log(req.body);
    let score = 10 * reps;

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { user_details: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find exercise
    const exercise = await prisma.exercises.findFirst({
      where: { name: exerciseName },
    });

    if (!exercise) {
      return res.status(400).json({ message: "Invalid exercise name" });
    }

    // Find or create user_exercises entry
    let userExercise = await prisma.user_exercises.findFirst({
      where: { userId: userId, exerciseId: exercise.id },
    });

    if (!userExercise) {
      userExercise = await prisma.user_exercises.create({
        data: {
          userId,
          exerciseId: exercise.id,
        },
      });
    }

    // Store workout log
    await prisma.exercise_logs.create({
      data: {
        userId,
        exerciseId: exercise.id,
        userExerciseId: userExercise.id,
        timeSecs: timeInSec,
        reps,
        score,
      },
    });

    // Update cumulative progress in user_exercises
    await prisma.user_exercises.update({
      where: { id: userExercise.id },
      data: {
        progress: { increment: reps },
      },
    });

    // Update total workout time in user_details
    if (user.user_details_id) {
      await prisma.user_details.update({
        where: { id: user.user_details_id },
        data: {
          time_worked_out: { increment: timeInSec },
          score: { increment: score },
        },
      });
    }

    res.status(200).json({ message: "Exercise logged successfully" });
  } catch (error) {
    console.error("Error logging exercise:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

app.get("/api/leaderboard", async (req, res) => {
  try {
    // Fetch top 10 users sorted by score in descending order
    const topUsers = await prisma.user_details.findMany({
      orderBy: {
        score: "desc", // Sorting by highest score
      },
      take: 10, // Limit to top 10 users
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Map users with position ranking
    const leaderboard = topUsers.map((user, index) => ({
      position: index + 1, // Rank starts from 1
      id: user.user?.id || null,
      name: user.user?.name || "Unknown",
      avatar: user.avatar || null,
      score: user.score,
    }));

    res.status(200).json({ leaderboard });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

initializeSocket(server);

server.listen(port, () => {
  console.log("Listening on " + port);
});
