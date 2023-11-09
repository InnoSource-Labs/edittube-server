const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const streamifier = require("streamifier");

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

function uploadtoCloudinary(videoBuffer) {
    try {
        let cld_upload_stream = cloudinary.uploader.upload_stream({ folder: "edittube_videos", resource_type: "video" }, function (error, result) {
            return result;
        });
        streamifier.createReadStream(videoBuffer).pipe(cld_upload_stream);
    }
    catch (error) {
        return error;
    }
}

async function deleteFromCloudinary(publicId) {
    try {
        const deleteRes = await cloudinary.uploader.destroy(publicId, {
            resource_type: "video"
        });
        console.log(deleteRes);
        return deleteRes;
    }
    catch (error) {
        return error;
    }
}

module.exports = { uploadtoCloudinary, deleteFromCloudinary }