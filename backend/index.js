const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);

require('dotenv').config()

//

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

io.on("connection", (socket)=>{
    console.log("New user connected!");

    socket.on("videoFrame", (msg)=>{
        io.emit("responseVideo", msg);
        
    })
    
})

//

server.listen(process.env.PORT, ()=>{
    console.log("Listening on " + process.env.PORT);
    
});