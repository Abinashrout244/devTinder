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

      if (!mongoose.Types.ObjectId.isValid(toUserId)) {
        return res.status(400).json({ message: "Invalid user Id" });
      }

      const isUserExist = await User.findById(toUserId);
      if (!isUserExist) {
        return res.status(404).json({ message: "User is not Found" });
      }

      //This logic ensures that duplicate or reverse connection requests are not allowed.
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
        message:
          req.findUser.firstName +
          " " +
          "is" +
          " " +
          status +
          " " +
          "on" +
          " " +
          isUserExist.firstName,
        data: data,
      });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  },
);

requestRouter.post(
  "/request/review/:status/:requestId",
  UserAuth,
  async (req, res) => {
    try {
      const logedinUser = req.findUser;
      const { status, requestId } = req.params;

      const allowFields = ["accepted", "rejected"];
      if (!allowFields.includes(status)) {
        return res.status(404).json({ message: "Invalid Status type!!" });
      }

      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        return res.status(404).json({ message: "Invalid requestId" });
      }

      const findRequestUser = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId: logedinUser._id,
        status: "intrested",
      });

      if (!findRequestUser) {
        return res
          .status(400)
          .json({ message: "Coonection request not found!" });
      }

      findRequestUser.status = status;

      const data = await findRequestUser.save();

      res.json({ message: "Connection request" + " " + status, data });
    } catch (err) {
      res.status(400).json({ message: "ERROR: " + err.message });
    }
  },
);

module.exports = requestRouter;
