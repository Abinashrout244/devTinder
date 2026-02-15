const express = require("express");
require("dotenv").config();
const app = express();
const cookieParser = require("cookie-parser");
const { connectDb } = require("./config/database");
const cors = require("cors");
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",

    credentials: true,
  }),
);

app.use(express.json()); //This is a built in middleware which is convert json -> js Object ,Provided by express
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/api/auth", authRouter);
app.use("/", cors(), profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

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

// const express = require("express");
// const app = express();
// const port = 3000;

// const bcrypt = require("bcryptjs");
// const cookieParser = require("cookie-parser");
// const jwt = require("jsonwebtoken");
// const validator = require("validator");
// const cors = require("cors");

// const { connectDb } = require("./config/database");
// const { User } = require("./models/user");
// const { validateSignupData } = require("./utils/validateSignupdata");
// const { UserAuth } = require("./middlewares/Adminauth");

// const corsOptions = {
//   origin: "http://localhost:5173",
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// };

// app.use(cors(corsOptions));
// app.options("*", cors(corsOptions)); // handle preflight properly

// app.use(express.json());
// app.use(cookieParser());

// const authRouter = require("./routes/auth");
// const profileRouter = require("./routes/profile");
// const requestRouter = require("./routes/request");
// const userRouter = require("./routes/user");

// app.use("/", authRouter);
// app.use("/", profileRouter);
// app.use("/", requestRouter);
// app.use("/", userRouter);

// connectDb()
//   .then(() => {
//     console.log("Mongo DB connection established....");
//     app.listen(port, () => {
//       console.log(`Server running successfully on port ${port}`);
//     });
//   })
//   .catch((err) => {
//     console.log("MongoDB connection not established..", err.message);
//   });
