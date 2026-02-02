const express = require("express");

const authRouter = express.Router();
const { validateSignupData } = require("../utils/validateSignupdata");
const { User } = require("../models/user");
const bcrypt = require("bcryptjs");
const validator = require("validator");

authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password, age, skills, gender } =
      req.body;
    //validator function
    validateSignupData(req);

    //incrypting/creating a hash password

    const hashPassword = await bcrypt.hash(password, 10);
    console.log(hashPassword);

    // creteing a new user instance..
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
      age,
      skills,
      gender,
    });
    await user.save();
    res.send("Adding data sucesfully..");
  } catch (err) {
    res.status(404).send("ERROR:" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("Plz!! Type Valid Email Id.");
    }
    const isEmail = await User.findOne({ emailId: emailId });
    // .select(  "+password" );
    if (!isEmail) {
      throw new Error("invalid Credintials!!");
    }
    const isPassword = await isEmail.validatePassword(password);
    if (isPassword) {
      const token = await isEmail.getJwt();

      res.cookie("token", token);
      res.json({ message: "User Logedin Sucessfully", data: isEmail });
    } else {
      throw new Error("invalid Credintials!!");
    }
  } catch (err) {
    res.status(404).send("ERROR:" + err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logout Sucessfully!!");
});

module.exports = authRouter;
