const express = require("express");
const { UserAuth } = require("../middlewares/Adminauth");

const requestRouter = express.Router();

requestRouter.post("/sendConnection", UserAuth, async (req, res) => {
  const user = req.findUser;

  res.send(user.firstName + " " + "sending connection request");
});

module.exports = requestRouter;
