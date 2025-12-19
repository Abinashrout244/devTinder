const express = require("express");
const app = express();
const port = 3000;

const { connectDb } = require("./config/database");
const { User } = require("./models/user");

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

//POST API for adding new user/instabce of a new user
app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.send("Adding data sucesfully..");
  } catch (err) {
    res.status(401).send("USER NOT SAVE SUCCESFULLY \n" + err.message);
  }
});

//GET API for Find  One User
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  const id = req.body._id;
  try {
    // const userInfo = await User.findOne({ emailId: userEmail });
    // res.send(userInfo);

    const userInfo = await User.findById(id);
    console.log(userInfo);

    res.send(userInfo);

    // const userInfo = await User.find({ emailId: userEmail });
    // if (userInfo.length === 0) {
    //   res.status(404).send("User is Empty!!");
    // } else {
    //   res.send(userInfo);
    // }
  } catch (err) {
    res.status(404).send("Something Went Wrong!!!" + err.message);
  }
});

//DELETE API for   One User
app.delete("/user", async (req, res) => {
  const id = req.body._id;
  try {
    const userInfo = await User.findByIdAndDelete(id, {
      projection: { firstName: 1, lastName: 1, emailId: 1 },
    });
    console.log(userInfo);

    res.send(userInfo);
  } catch (err) {
    res.status(404).send("Something Went Wrong!!!" + err.message);
  }
});

//GET API for finding all  User
app.get("/feed", async (req, res) => {
  try {
    const userInfo = await User.find({});
    if (userInfo.length === 0) {
      res.status(404).send("User is Empty!!");
    } else {
      res.send(userInfo);
    }
  } catch (err) {
    res.status(404).send("Something Went Wrong!!!");
  }
});

//UPDATE API for upadting the documets.

app.patch("/user", async (req, res) => {
  const id = req.body._id;
  //console.log(req.body);

  try {
    const userInfo = await User.findByIdAndUpdate(id, req.body, {
      returnDocument: "after",
    });
    // res.send("User is Updated!!!");
    res.send(userInfo);
    console.log(userInfo);
  } catch (err) {
    res.status(404).send("Something went Wrong.." + err.message);
  }
});

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
