import express from "express";
import socketIO from "socket.io";
import http from "http";
import { Users } from "./interfaces/Users";
import dotenv from "dotenv";

dotenv.config();
const app = express();

let onlineUsers = {} as Users;

const server = http.createServer(app);
const io = new socketIO.Server(server, {
  cors: {
    origin: process.env.ORIGINS?.split(" "),
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("onlineUser", ({ details }) => {
    onlineUsers[socket.id] = details;
    io.emit("usersChanged", { onlineUsers });
  });

  socket.on("disconnect", () => {
    delete onlineUsers[socket.id];

    io.emit("usersChanged", { onlineUsers });
  });
});

server.listen(process.env.port || 3000, () => {
  console.log(`App running on port ${process.env.port || 3000}`);
});
