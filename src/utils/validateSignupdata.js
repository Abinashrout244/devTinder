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

const validateProfileData = (req) => {
  const allowFilled = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "skills",
    "about",
    "photoURL",
  ];

  const isAllowdFields = Object.keys(req.body).every((field) =>
    allowFilled.includes(field)
  );

  return isAllowdFields;
};

module.exports = {
  validateSignupData,
  validateProfileData,
};
