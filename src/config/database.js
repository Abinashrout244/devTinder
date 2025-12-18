const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://abhiabinash104_db_user:mHoqSZGGwTU5y50V@shadow0.ze7nowp.mongodb.net/devTinder"
    // ?retryWrites=true&w=majority
  );
};

module.exports = { connectDb };
