const express = require("express");
const http = require("http");
const router = require("./routes/routes");
const initializeSocket = require("./connections/socket.js");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const port = process.env.PORT;

app.use(router);

// Initialize WebSocket
initializeSocket(server);

server.listen(port, () => {
  console.log("Listening on " + port);
});
