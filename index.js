const express = require("express");
const uploadVideo = require("./upload")

const app = express();
const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
    try {
        uploadVideo.uploadVideo("Hello", "World", "TEST")
    }
    catch(err) {
        console.error(err)
    }
});

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
