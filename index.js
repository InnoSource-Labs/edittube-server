require('dotenv').config()
const express = require("express");
const multer = require("multer");
const Stream = require("stream")

const save = multer();
const uploadVideo = require("./upload")

const mongoose = require("mongoose")
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 8000;
const DB_URL = process.env.atlas_URL
mongoose.connect(DB_URL)
const dbConnect = mongoose.connection
dbConnect.once("open",()=>{
    console.log("successfull connected to database");
})
dbConnect.on("error",()=>{
    console.log("failed to connnect to  database");
})
app.post("/", save.array("videoFile"), (req, res) => {
    try {
        const file = req.files?.[0]?.buffer;
        const stream = Stream.Readable.from(file);
        uploadVideo.uploadVideo("Hello", "World", "TEST", stream)
        return res;
    }
    catch(err) {
        console.error(err)
    }
});

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
