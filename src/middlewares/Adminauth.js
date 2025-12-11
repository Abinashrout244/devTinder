const AdminAuth = (req, res, next) => {
  console.log("AdminAuth Checked!!!!!");

  const token = "shadow";
  const isAuthorised = token === "shadow";
  if (!isAuthorised) {
    res.status(401).send("UnAuthorised Request???");
  } else {
    next();
  }
};

const UserAuth = (req, res, next) => {
  console.log("AdminAuth Checked!!!!!");

  const token = "shadow";
  const isAuthorised = token === "shadow";
  if (!isAuthorised) {
    res.status(401).send("UnAuthorised Request???");
  } else {
    next();
  }
};

module.exports = {
  AdminAuth,
  UserAuth,
};
