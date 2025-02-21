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

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Determine exercise type and insert workout data
    if (exerciseName.toLowerCase() === "pushups") {
      await prisma.push_db.create({
        data: {
          userId: userId,
          count: reps,
        },
      });
    } else if (exerciseName.toLowerCase() === "squats") {
      await prisma.squats_db.create({
        data: {
          userId: userId,
          count: reps,
        },
      });
    } else {
      return res.status(400).json({ message: "Invalid exercise name" });
    }

    // Update user_details (increase time_worked_out)
    await prisma.user_details.update({
      where: { id: user.user_details_id },
      data: {
        time_worked_out: {
          increment: timeInSec, // Increment time worked out
        },
      },
    });

    res.status(200).json({ message: "Workout data recorded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

// Initialize WebSocket
initializeSocket(server);

server.listen(port, () => {
  console.log("Listening on " + port);
});
