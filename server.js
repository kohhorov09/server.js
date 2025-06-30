const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const httpServer = createServer(app);

// Agar kerak bo‘lsa statik fayllar uchun, misol uchun:
// app.use(express.static("public"));

const io = new Server(httpServer, {
  cors: {
    origin: "*", // yoki domeningiz: "https://yourapp.vercel.app"
    methods: ["GET", "POST"]
  }
});

// WebSocket hodisalarini boshqaramiz
io.on("connection", (socket) => {
  console.log("🚀 Yangi socket bog‘landi:", socket.id);

  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);

    socket.on("toggle-camera", (data) => {
      socket.to(roomId).emit("toggle-camera", data);
    });
    socket.on("toggle-mic", (data) => {
      socket.to(roomId).emit("toggle-mic", data);
    });

    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", userId);
    });
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => console.log(`✅ Server started on port ${PORT}`));
