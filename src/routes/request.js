const express = require("express");
const { UserAuth } = require("../middlewares/Adminauth");
const { ConnectionRequestModel } = require("../models/connectionRequest");
const { User } = require("../models/user");
const { default: mongoose } = require("mongoose");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  UserAuth,
  async (req, res) => {
    try {
      const fromUserId = req.findUser._id;

      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowFields = ["intrested", "ignored"];
      if (!allowFields.includes(status)) {
        throw new Error("Invalid status type");
      }

      // if (fromUserId.toString() === toUserId) {
      //   throw new Error("You can't send Connection request Yourself!");
      // }

      if (!mongoose.Types.ObjectId.isValid(toUserId)) {
        return res.status(400).json({ message: "Invalid user Id" });
      }

      const isUserExist = await User.findById(toUserId);
      if (!isUserExist) {
        return res.status(404).json({ message: "User is not Found" });
      }

      const existingConnectionRequest = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ message: "connection request already exist!!" });
      }

      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      res.json({
        message: "Connection request sent sucessfully!!",
        data: data,
      });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

module.exports = requestRouter;
