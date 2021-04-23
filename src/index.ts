import express from "express";
import socketIO from "socket.io";
import http from "http";
import { UsersRepository, User } from "./Users";
import dotenv from "dotenv";

dotenv.config();
const app = express();

let onlineUsers = new UsersRepository();

const server = http.createServer(app);
const io = new socketIO.Server(server, {
  cors: {
    origin: process.env.ORIGINS?.split(" "),
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket: socketIO.Socket) => {
  socket.on("onlineUser", ({ details }) => {
    onlineUsers.pushUser(new User(details, socket.id));

    io.emit("usersChanged", {
      onlineUsers: onlineUsers.getUsers,
    });
  });

  socket.on("disconnect", () => {
    try {
      onlineUsers.removeUser(socket.id);

      io.emit("usersChanged", {
        onlineUsers: onlineUsers.getUsers,
      });
    } catch (e) {
      return new Error(e);
    }
  });
});

server.listen(process.env.port || 3000, () => {
  console.log(`App running on port ${process.env.port || 3000}`);
});
