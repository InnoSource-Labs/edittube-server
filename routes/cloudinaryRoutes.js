const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const express = require("express")

const router = express.Router();

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

router.route('/').post(async (req, res) => {
    try {
        const file = "./bunny.mp4"
        const videoRes = await cloudinary.uploader.upload(file,
            {
                resource_type: "video",
                folder: "edittube_videos"
            }
        )
        res.status(200).json({ success: true, message: "Uploaded video successfully", data: videoRes });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error })
    }
})

router.route('/').delete(async (req, res) => {
    try {
        const publicId = "edittube_videos/g3gy3rnfhmcmxaprkqyh"
        const deleteRes = await cloudinary.uploader.destroy(publicId, {
            resource_type: "video"
        });
        res.status(200).json({ success: true, message: "Deleted asset successfully", data: deleteRes })
    }
    catch (error) {
        res.status(500).json({ success: false, message: error })
    }
})

module.exports = router