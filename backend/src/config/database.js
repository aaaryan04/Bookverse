const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log("MONGODB_URI:", process.env.MONGODB_URI); // 👈 DEBUG

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;