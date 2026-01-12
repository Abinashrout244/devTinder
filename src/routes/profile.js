const express = require("express");
const { UserAuth } = require("../middlewares/Adminauth");

const profileRouter = express.Router();
profileRouter.get("/profile", UserAuth, async (req, res) => {
  try {
    // const cookie = req.cookies;
    // const { token } = cookie;
    // if (!token) {
    //   throw new Error("Invalid Token");
    // }

    // const decodedMsg = await jwt.verify(token, "AVI@890");

    // const { _id } = decodedMsg;

    // const findUser = await User.findById(_id);

    // if (!findUser) {
    //   throw new Error("User not found");
    // }

    const findUser = req.findUser; //This is user is come from the auth middle ware.

    res.send(findUser);
  } catch (err) {
    console.log(err);
    res.status(404).send("Something went wrong:" + err.message);
  }
});

module.exports = profileRouter;
