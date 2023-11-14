const dotenv = require("dotenv");

dotenv.config();

const enviroment = {
    port: process.env.PORT,
    mongo_uri: process.env.MONGO_URI,
    cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
};

module.exports = enviroment;
