require("dotenv").config();
const express = require("express");
const { connectDB } = require("./config/database");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);
});
