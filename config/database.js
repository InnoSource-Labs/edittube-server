const mongoose = require("mongoose");
const enviroment = require("../enviroment");

const connectDB = async () => {
    try {
        await mongoose.connect(enviroment.mongo_uri);
        console.log("Successfully connected to the database");
    } catch (error) {
        console.error("Failed to connect to the database:", error);
    }

    mongoose.connection.on("error", (error) => {
        console.error("Database connection error:", error);
    });
};

module.exports = { connectDB };
