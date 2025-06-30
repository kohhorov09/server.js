// server.js
import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";
import cors from "cors";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // yoki "https://your-vercel-app.vercel.app"
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
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
httpServer.listen(PORT, () => console.log(`✅ Server started on ${PORT}`));
