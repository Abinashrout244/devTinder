const mongoose = require("mongoose");
const validator = require("validator");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "This field must be required!!!"],
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },

    emailId: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Enter a valid email" + " " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Give a Strong Password.." + " " + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
      required: true,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: "{VALUE} is not a valid gender type",
      },
    },
    skills: {
      type: [String],
    },
    photoURL: {
      type: String,
      default:
        "https://tse3.mm.bing.net/th/id/OIP.MbNT4K5OHJV-eMtZcOS0ZgHaEo?pid=Api&P=0&h=180",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Give a valid URL" + " " + value);
        }
      },
    },
    isPrime: {
      type: Boolean,
      default: false,
    },
    about: {
      type: String,
      default: "This is a default value of the User!!!",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("user", userSchema);
module.exports = { User };
