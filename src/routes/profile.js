const express = require("express");
const { UserAuth } = require("../middlewares/Adminauth");
const { validateProfileData } = require("../utils/validateSignupdata");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const profileRouter = express.Router();
profileRouter.get("/profile/view", UserAuth, async (req, res) => {
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

    res.json({ findUser });
  } catch (err) {
    console.log(err);
    res.status(404).send("Something went wrong:" + err.message);
  }
});

profileRouter.put("/profile/edit", UserAuth, async (req, res) => {
  try {
    if (!validateProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }
    const logedinUser = req.findUser;
    if (req.body.photoURL && !validator.isURL(req.body.photoURL)) {
      throw new Error("The URL is not valid");
    }
    if (req.body.about && req.body.about.length > 200) {
      throw new Error("Your length is more");
    }
    if (req.body.skills && req.body.skills.length > 5) {
      throw new Error("Your length is more");
    }

    Object.keys(req.body).forEach(
      (keys) => (logedinUser[keys] = req.body[keys]),
    );
    await logedinUser.save();

    res.json({
      meassge: `${logedinUser.firstName} ,Your Data update sucessfulyy`,
      data: logedinUser,
    });
  } catch (err) {
    res.status(401).send("ERROR:" + err.message);
  }
});

profileRouter.put("/profile/password", UserAuth, async (req, res) => {
  try {
    const { password } = req.body;
    const logedinUser = req.findUser;
    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }
    if (!validator.isStrongPassword(password)) {
      throw new Error("Provide a Strong Password!!");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    logedinUser.password = hashPassword;

    await logedinUser.save();
    res.json({
      message: `${logedinUser.firstName} ,Your password update sucessfulyy`,
    });
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

module.exports = profileRouter;

//*The PATCH api shows CORS Eroor and  it takes lots of time but not fix for complete my Project i wil do with PUT Api. i will be doin it later
