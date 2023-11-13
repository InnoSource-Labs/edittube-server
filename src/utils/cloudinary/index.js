const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

function uploadtoCloudinary(videoBuffer) {
    return new Promise((resolve, reject) => {
        let cld_upload_stream = cloudinary.uploader.upload_stream(
            {
                folder: "edittube_videos",
                resource_type: "video",
            },
            (error, result) => {
                if (result) resolve(result);
                else reject(error);
            }
        );
        streamifier.createReadStream(videoBuffer).pipe(cld_upload_stream);
    });
}

async function deleteFromCloudinary(publicId) {
    try {
        const deleteRes = await cloudinary.uploader.destroy(publicId, {
            resource_type: "video",
        });
        return deleteRes;
    } catch (error) {
        return error;
    }
}

module.exports = { uploadtoCloudinary, deleteFromCloudinary };
