require('dotenv').config()
const express = require("express");
const multer = require("multer");
const Stream = require("stream")
const save = multer();
const uploadVideo = require("./upload")

const { connectDb } = require("./database/connectDb")
const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/", save.array("videoFile"), (req, res) => {
    try {
        const file = req.files?.[0]?.buffer;
        const stream = Stream.Readable.from(file);
        uploadVideo.uploadVideo("Hello", "World", "TEST", stream)
        return res;
    }
    catch (err) {
        console.error(err)
    }
});
connectDb()
app.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);
});
