const { Server } = require("socket.io");
const { spawn } = require("child_process");

function initializeSocket(server) {
  const io = new Server(server, {
    cors: "https://localhost:3000"
  });

  io.on("connection", (socket) => {
    console.log("New user connected!");

    let pythonProcess = null;

    socket.on("startTracking", () => {
      console.log("Tracking started...");
      
      if (!pythonProcess) {
        pythonProcess = spawn("python", ["../../model/squats.py"]);

        pythonProcess.stdout.on("data", (data) => {
          // console.log(data);
          
          try {
            const receivedData = JSON.parse(data.toString());
            //console.log(receivedData);
            
            io.emit("trackingData", receivedData);
          } catch (error) {
            console.error("Error parsing JSON:", error);
            console.log("Raw data from Python:", data.toString());
          }
        });

        pythonProcess.stderr.on("data", (data) => {
          console.error(`Python error: ${data}`);
          socket.emit("trackingError", data.toString());
        });

        pythonProcess.on("close", (code) => {
          console.log(`Python script exited with code ${code}`);
          pythonProcess = null;
          io.emit("trackingEnded");
        });

        pythonProcess.on("error", (err) => {
          console.error("Failed to spawn Python process:", err);
          pythonProcess = null;
          socket.emit("trackingError", "Failed to start tracking.");
        });
      } else {
        socket.emit("trackingError", "Tracking already started.");
      }
    });

    socket.on("stopTracking", () => {
      if (pythonProcess) {
        pythonProcess.kill();
        pythonProcess = null;
        console.log("Tracking stopped.");
        io.emit("trackingEnded");
      }
    });

    socket.on("videoFrame", (frame) => {
      //console.log("adasd");
      
      if (pythonProcess) {
        const dataToSend = { frame: frame.split("base64,")[1] };
        pythonProcess.stdin.write(JSON.stringify(dataToSend) + "\n");
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected!");
      if (pythonProcess) {
        pythonProcess.kill();
        pythonProcess = null;
      }
    });
  });
}

module.exports = initializeSocket;
