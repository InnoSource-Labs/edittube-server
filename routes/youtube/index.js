const multer = require("multer");
const Stream = require("stream");
const { Router } = require("express");
const { uploadVideo } = require("../../utils/youtube");

const save = multer();
const router = Router();

router.post("/", save.array("videoFile"), (req, res) => {
    try {
        const file = req.files?.[0]?.buffer;
        const stream = Stream.Readable.from(file);
        uploadVideo.uploadVideo("Hello", "World", "TEST", stream);
        return res;
    } catch (err) {
        console.error(err);
    }
});

module.exports = router;
