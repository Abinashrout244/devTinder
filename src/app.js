const express = require("express");
const app = express();
const port = 3000;

app.use("/mid", (req, res, next) => {
  res.send("Middleware Working is fine...");
});
// app.use("mid", (req, res, next) => {
//   console.log("Middleware Working...");
//   next(); // Go to next handler
// });

// app.get("/", (req, res) => {
//   res.send("Hello AVI This is my first Server!!");
// });

// app.get("/file", (req, res) => {
//   res.send("Go to MAin file..!!");
// });
app.use("/text", (req, res) => {
  res.send("Hello AVI This is my first Server!!");
});

app.use("/file", (req, res) => {
  res.send("Go to MAin file..!!");
});

app.listen(port, () => {
  console.log("server is sucessfully Done!!!");
});
