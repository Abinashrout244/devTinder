const validator = require("validator");
const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Please enter a valid Name!!");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Please enter a valid EmailId!!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a Strong password!!");
  }
};

module.exports = {
  validateSignupData,
};
