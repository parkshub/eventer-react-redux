require ("dotenv").config()
const cloudinary = require("cloudinary").v2

cloudinary.config({
    cloud_name: process.env.REACT_APP_CLOUD_NAME,
    api_key: process.env.REACT_APP_API_KEY,
    api_secret: process.env.REACT_APP_API_SECRET,
});

module.exports = cloudinary