const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const enviroment = require("../enviroment");

cloudinary.config({
    cloud_name: enviroment.cloudinary_cloud_name,
    api_key: enviroment.cloudinary_api_key,
    api_secret: enviroment.cloudinary_api_secret,
    secure: true,
});

function uploadToCloudinary(videoBuffer) {
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

module.exports = { uploadToCloudinary, deleteFromCloudinary };
