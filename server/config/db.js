const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ Connected to MongoDB Atlas");
  } catch (error) {
    console.error("MongoDB connection failed", error.message);
    process.exit(1); // Stop the server
  }
};

module.exports = connectDB