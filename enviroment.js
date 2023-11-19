const dotenv = require("dotenv");

dotenv.config();

const enviroment = {
    port: process.env.PORT,
    mongo_uri: process.env.MONGO_URI,
    origin_uri: process.env.ORIGIN_URI,
    cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
    auth_domin: process.env.AUTH_DOMAIN,
    api_identifier: process.env.API_IDENTIFIER,
};

module.exports = enviroment;
