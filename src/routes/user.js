const express = require("express");
const userRouter = express.Router();
const { UserAuth } = require("../middlewares/Adminauth");
const { ConnectionRequestModel } = require("../models/connectionRequest");

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
      data: connectionRequest,
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
    console.log(connectionRequest);

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

module.exports = userRouter;
