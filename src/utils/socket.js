const { Server } = require("socket.io");
const crypto = require("crypto");
const socketAuth = require("../middlewares/Socket.middleware");
const cors = require("cors");

const hashRoomId = (userId, receiverId) => {
  return crypto
    .createHash("sha256")
    .update([String(userId), String(receiverId)].sort().join("_"))
    .digest("hex");
};

const initialiseSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  io.use(socketAuth);

  io.on("connection", (socket) => {
    console.log("User Connected:", socket?.user?.firstName);

    socket.on("joinChat", ({ receiverId }) => {
      if (!receiverId) {
        socket.emit("socketError", { message: "receiverId is required" });
        return;
      }

      const userId = socket.user._id;
      const roomId = hashRoomId(userId, receiverId);

      console.log(socket.user.firstName + " Joined in Room: " + roomId);
      socket.join(roomId);
    });

    socket.on("sendMessage", ({ receiverId, text }) => {
      if (!receiverId || !text || !text.trim()) {
        socket.emit("socketError", {
          message: "receiverId and non-empty text are required",
        });
        return;
      }

      const userId = socket.user._id;
      const roomId = hashRoomId(userId, receiverId);
      const payload = {
        senderId: String(socket.user._id),
        firstName: socket.user.firstName,
        text: text.trim(),
        createdAt: new Date().toISOString(),
      };

      io.to(roomId).emit("messageReceived", payload);
    });

    socket.on("disconnect", () => {
      console.log((socket?.user?.firstName || "User") + " is disconnected");
    });
  });

  return io;
};

module.exports = initialiseSocket;
