const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

// const AdminAuth = (req, res, next) => {
//   console.log("AdminAuth Checked!!!!!");

//   const token = "shadow";
//   const isAuthorised = token === "shadow";
//   if (!isAuthorised) {
//     res.status(401).send("UnAuthorised Request???");
//   } else {
//     next();
//   }
// };

const UserAuth = async (req, res, next) => {
  try {
    const cookie = req.cookies;
    const { token } = cookie;
    if (!token) {
      throw new Error("Invalid Token!!");
    }

    const decodeData = await jwt.verify(token, "AVI@890");
    const { _id } = decodeData;

    const findUser = await User.findById(_id);
    if (!findUser) {
      throw new Error("User Not Found");
    }

    req.findUser = findUser;
    next();
  } catch (err) {
    res.status(404).send("Error:" + err.message);
    console.log(err);
  }
};

module.exports = {
  // AdminAuth,
  UserAuth,
};
