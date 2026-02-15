const mongoose = require("mongoose");
const URL = process.env.MONGO_URL;

const connectDb = async () => {
  await mongoose.connect(
    URL,
    // ?retryWrites=true&w=majority
  );
};

module.exports = { connectDb };
