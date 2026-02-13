const express = require("express");
const userRouter = express.Router();
const { UserAuth } = require("../middlewares/Adminauth");
const { ConnectionRequestModel } = require("../models/connectionRequest");
const { User } = require("../models/user");

const USER_SAFE_DATA = "firstName lastName skills about gender age photoURL";

userRouter.get("/user/requests/recieved", UserAuth, async (req, res) => {
  try {
    const logedinUser = req.findUser;

    const connectionRequest = await ConnectionRequestModel.find({
      toUserId: logedinUser._id,
      status: "intrested",
    }).populate("fromUserId", USER_SAFE_DATA);
    // .populate("fromUserId", [
    //   "firstName",
    //   "lastName",
    //   "age",
    //   "gender",
    //   "skills",
    //   "photoURL",
    //   "about",
    // ]);

    res.json({
      message: "User data Fetched sucessfully",
      connectionRequest,
    });
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

userRouter.get("/user/connections", UserAuth, async (req, res) => {
  try {
    const logedinUser = req.findUser;

    const connectionRequest = await ConnectionRequestModel.find({
      $or: [
        { toUserId: logedinUser._id, status: "accepted" },
        { fromUserId: logedinUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);
    //console.log(connectionRequest);

    const data = connectionRequest.map((dta) => {
      // if (dta.fromUserId._id.toString() === logedinUser._id.toString()) {
      if (dta.fromUserId._id.equals(logedinUser._id)) {
        return dta.toUserId;
      } else {
        return dta.fromUserId;
      }
    });

    res.json({ data });
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

userRouter.get("/user/feed", UserAuth, async (req, res) => {
  try {
    const logedinUser = req.findUser;

    const connectionRequest = await ConnectionRequestModel.find({
      $or: [{ fromUserId: logedinUser._id }, { toUserId: logedinUser._id }],
    }).select("fromUserId toUserId");
    // .populate("fromUserId", "firstName")
    // .populate("toUserId", "firstName");

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    limit = limit > 50 ? 50 : limit;

    const blockedUser = new Set();

    connectionRequest.forEach((val) => {
      blockedUser.add(val.fromUserId.toString());
      blockedUser.add(val.toUserId.toString());
    });

    // console.log([...blockedUser]);

    const data = await User.find({
      $and: [
        { _id: { $nin: Array.from(blockedUser) } },
        { _id: { $ne: logedinUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    //console.log(data);

    res.json({ data });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;
