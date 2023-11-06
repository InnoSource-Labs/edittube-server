const express = require("express");
const multer = require("multer");

const save = multer({ dest: "uploads/" });
const uploadVideo = require("./upload")

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 8000;

app.post("/", save.array("videoFile"), (req, res) => {
    try {
        console.log(req.files)
        uploadVideo.uploadVideo("Hello", "World", "TEST")
        return res
    }
    catch (err) {
        console.error(err)
    }
});

app.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);
});
