const express = require("express");
const enviroment = require("./enviroment");
const authRoute = require("./routes/auth");
const { connectDB } = require("./config/database");

const app = express();
const port = enviroment.port || 8000;

connectDB();

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoute);

app.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);
});
