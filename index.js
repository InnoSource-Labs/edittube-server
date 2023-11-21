const express = require("express");
const enviroment = require("./enviroment");
const userRoute = require("./routes/user");
const workspaceRoute = require("./routes/workspace");
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { jwtCheck, unauthorized } = require("./middleware/auth");

const app = express();
const port = enviroment.port || 8000;

connectDB();

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: enviroment.origin_uri }));
app.use(cookieParser());

app.use(jwtCheck);
app.use(unauthorized);

app.use("/users", userRoute);
app.use("/workspace", workspaceRoute);

app.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);
});
