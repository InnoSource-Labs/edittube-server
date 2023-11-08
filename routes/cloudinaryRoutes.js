const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const express = require("express")
const multer = require("multer");
const streamifier = require("streamifier");
const save = multer();

const router = express.Router();

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

router.post('/', save.array("videoFile"), async (req, res) => {
    try {
        const videoFile = req.files?.[0]?.buffer;
        let cld_upload_stream = cloudinary.uploader.upload_stream({ folder: "edittube_videos", resource_type: "video" }, function (error, result) {
            res.status(200).json({ success: true, message: "Video uploaded successfully", data: result });
        });
        streamifier.createReadStream(videoFile).pipe(cld_upload_stream);
    }
    catch (error) {
        res.status(500).json({ success: false, message: error })
    }
})

router.delete('/', async (req, res) => {
    try {
        const { publicId } = req.body;
        if (!publicId) {
            res.status(400).json({ success: false, message: "Please provide publicId" })
        }
        const deleteRes = await cloudinary.uploader.destroy(publicId, {
            resource_type: "video"
        });
        res.status(200).json({ success: true, message: "Video deleted successfully", data: deleteRes })
    }
    catch (error) {
        res.status(500).json({ success: false, message: error })
    }
})

module.exports = router