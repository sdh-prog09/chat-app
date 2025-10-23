const express = require("express")
const connectDB = require("./config/db")
const authRoutes = require("./routes/auth")
const { connect } = require("mongoose")
const protectedChat = require("./routes/chat.js")
const userRoutes = require("./routes/user");


const cors = require("cors")    //************************* */
require("dotenv").config()

const app = express()


const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {                        //*************************** */
        origin: "*",
        methods: ["GET", "POST"]
    }
})

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.get("/", (req, res) => {
  res.send("Server is running. Welcome to InTouch backend.");
});

connectDB()

app.use(express.json())
app.use(cors());
app.use("/api/auth", authRoutes)
app.use("/api", protectedChat)
app.use("/api", userRoutes);

const userSocketMap = {}; // socket.id => username

io.on("connection", (socket) => {
  console.log("✅ A user connected:", socket.id);
  socket.on("join", (userId, username) => {
    socket.join(userId); // user joins their own room with userId
    userSocketMap[socket.id] = username;
    console.log(`User ${username} joined their room`);
  });
  socket.on("private-message", ({ to, message, username }) => {
    io.to(to).emit("private-message", {
      from: socket.id,
      message,
      username
    });
  });
  //TYPING indicator:                                   (2nd step)
  socket.on("typing", ({ to, from, username }) => {
    io.to(to).emit("typing", { from, username });
  });
  socket.on("disconnect", () => {
    const username = userSocketMap[socket.id];              //*********************
    console.log(`--> A user disconnected: ${username}`)
    delete userSocketMap[socket.id]; // Clean up
  });
});

const PORT = process.env.PORT || 5000
// app.listen(PORT, () => console.log(`server listening to the port ${PORT}`))
server.listen(PORT, () => console.log(`server running at the port ${PORT}`))

