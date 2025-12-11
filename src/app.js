const express = require("express");
const app = express();
const port = 3000;

// app.get("/", (req, res) => {
//   res.send("Hello AVI This is my first Server!!");
// });

// app.get("/user/:userId/:name", (req, res) => {
//console.log(req.query);
//console.log(req.params);
// app.get(/^\/user?$/, (req, res) => {
//   res.send({ firstName: "AVI", lastName: "SHADOW" });
// });
const { AdminAuth, UserAuth } = require("./middlewares/Adminauth");

app.use("/admin", AdminAuth);

app.get("/admin/getData", (req, res, next) => {
  res.send("get all Admin data!!!");
});

app.get("/admin/deleteData", (req, res) => {
  res.send("Delete all admin Data!!");
});

app.use("/user", UserAuth, (req, res, next) => {
  console.log("First response..");
  res.send("user Info..");
});

app.listen(port, () => {
  console.log("server is sucessfully Done!!!");
});
