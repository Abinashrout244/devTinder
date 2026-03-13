const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const cookie = require("cookie");

const socketAuth = async (socket, next) => {
  try {
    const cookies = cookie.parse(socket.handshake.headers.cookie || "");
    const { token } = cookies;

    if (!token) {
      return next(new Error("Token missing. Please login"));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decodedData;

    const user = await User.findById(_id);

    if (!user) {
      return next(new Error("User not found"));
    }

    socket.user = user;

    next();
  } catch (err) {
    next(new Error("Authentication failed"));
  }
};

module.exports = socketAuth;
