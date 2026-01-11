const express = require("express");
const app = express();
const port = 3000;
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const { connectDb } = require("./config/database");
const { User } = require("./models/user");
const { validateSignupData } = require("./utils/validateSignupdata");
const { UserAuth } = require("./middlewares/Adminauth");

// app.get("/", (req, res) => {
//   res.send("Hello AVI This is my first Server!!");
// });

// app.get("/user/:userId/:name", (req, res) => {
//console.log(req.query);
//console.log(req.params);
// app.get(/^\/user?$/, (req, res) => {
//   res.send({ firstName: "AVI", lastName: "SHADOW" });
// });
// const { AdminAuth, UserAuth } = require("./middlewares/Adminauth");

// app.use("/admin", AdminAuth);

// app.get("/admin/getData", (req, res, next) => {
//   res.send("get all Admin data!!!");
// });

// app.get("/admin/deleteData", (req, res) => {
//   res.send("Delete all admin Data!!");
// });

// app.use("/user", UserAuth, (req, res, next) => {
//   console.log("First response..");
//   res.send("user Info..");
// });

// app.get("/user", (req, res) => {
//   try {
//     throw new Error("This is a manual error throw by me!!");
//     res.send("user information!!!");
//   } catch (err) {
//     res.status(500).send("something went wrong plz try again !!!");
//   }
// });

// app.use("/", (err, req, res, next) => {
//   if (err) {
//     res.status(500).send("something went wrong!!!");
//   }
// });

app.use(express.json()); //*This is a built in middleware which is convert json -> js Object ,Provided by express
app.use(cookieParser());

//POST API for adding new user/instabce of a new user
app.post("/signup", async (req, res) => {
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

//POST login api for Users

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("Plz!! Type Valid Email Id.");
    }
    const isEmail = await User.findOne({ emailId: emailId });
    if (!isEmail) {
      throw new Error("invalid Credintials!!");
    }
    const isPassword = await isEmail.validatePassword(password);
    if (isPassword) {
      const token = await isEmail.getJwt();

      res.cookie("token", token);
      res.send("User Logedin Sucessfulyy!!");
    } else {
      throw new Error("invalid Credintials!!");
    }
  } catch (err) {
    res.status(404).send("ERROR:" + err.message);
  }
});

app.get("/profile", UserAuth, async (req, res) => {
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

app.post("/sendConnection", UserAuth, async (req, res) => {
  const user = req.findUser;

  res.send(user.firstName + " " + "sending connection request");
});

//GET API for Find  One User
// app.get("/user", async (req, res) => {
//   const userEmail = req.body.emailId;
//   const id = req.body._id;
//   try {
//     // const userInfo = await User.findOne({ emailId: userEmail });
//     // res.send(userInfo);

//     const userInfo = await User.findById(id);
//     console.log(userInfo);

//     res.send(userInfo);

//     // const userInfo = await User.find({ emailId: userEmail });
//     // if (userInfo.length === 0) {
//     //   res.status(404).send("User is Empty!!");
//     // } else {
//     //   res.send(userInfo);
//     // }
//   } catch (err) {
//     res.status(404).send("Something Went Wrong!!!" + err.message);
//   }
// });

//DELETE API for   One User
// app.delete("/user", async (req, res) => {
//   const id = req.body._id;
//   try {
//     const userInfo = await User.findByIdAndDelete(id, {
//       projection: { firstName: 1, lastName: 1, emailId: 1 },
//     });
//     console.log(userInfo);

//     res.send(userInfo);
//   } catch (err) {
//     res.status(404).send("Something Went Wrong!!!" + err.message);
//   }
// });

//GET API for finding all  User
// app.get("/feed", async (req, res) => {
//   try {
//     const userInfo = await User.find({});
//     if (userInfo.length === 0) {
//       res.status(404).send("User is Empty!!");
//     } else {
//       res.send(userInfo);
//     }
//   } catch (err) {
//     res.status(404).send("Something Went Wrong!!!");
//   }
// });

//UPDATE API for upadting the documets.

// app.patch("/user", async (req, res) => {
//   const id = req.body._id;

//   try {
//     const userInfo = await User.findByIdAndUpdate(id, req.body, {
//       returnDocument: "after",
//     });
//     // res.send("User is Updated!!!");
//     res.send(userInfo);
//   } catch (err) {
//     res.status(404).send("Something went Wrong.." + err.message);
//   }
// });

connectDb()
  .then(() => {
    console.log("Mongo DB connection established....");
    app.listen(port, () => {
      console.log("server is sucessfully Done!!!");
    });
  })
  .catch((err) => {
    console.log("Mongodb connection not Established..");
  });
