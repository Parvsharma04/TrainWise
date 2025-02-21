const express = require("express");
const http = require("http");
const router = require("./routes/userRouter.js");
const initializeSocket = require("./connections/socket.js");
const excerciseRouter = require("./routes/excerciseRouter.js");
const userRouter = require("./routes/userRouter.js");
require("dotenv").config();
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const port = process.env.PORT;

app.use(cors());
app.use(router);

app.use("/user", userRouter);
app.use("/excercises", excerciseRouter);

// Initialize WebSocket
initializeSocket(server);

server.listen(port, () => {
  console.log("Listening on " + port);
});
