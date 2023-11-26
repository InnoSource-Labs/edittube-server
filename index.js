const cors = require("cors");
const express = require("express");
const enviroment = require("./enviroment");
const userRoute = require("./routes/user");
const videoRoute = require("./routes/video");
const reviewRoute = require("./routes/review");
const workspaceRoute = require("./routes/workspace");
const verifyRoute = require("./routes/verify");
const { jwtCheck, unauthorized } = require("./middleware/auth");
const { connectDB } = require("./config/database");

const app = express();
const port = enviroment.port || 8000;

connectDB();

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: enviroment.origin_uri }));

app.use(jwtCheck);
app.use(unauthorized);

app.use("/users", userRoute);
app.use("/workspaces", workspaceRoute);
app.use("/workspaces/:workspaceId/videos", videoRoute);
app.use("/workspaces/:workspaceId/videos/:videoId", reviewRoute);
app.use("/verify", verifyRoute);

app.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);
});
