const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;

const connectDb = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Successfully connected to the database");
    } catch (error) {
        console.error("Failed to connect to the database:", error);
    }

    mongoose.connection.on("error", (error) => {
        console.error("Database connection error:", error);
    });
};

module.exports = { connectDb };
