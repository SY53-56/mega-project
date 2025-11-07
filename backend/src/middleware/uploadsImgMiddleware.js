const cloudinary = require("../config/cloudinary")
const {CloudinaryStorage } = require("multer-storage-cloudinary")
const multer = require("multer")


const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        floder:"blogs",
        allowed_format:["jpg", "jpeg", "png", "webp"]
    }
})
const uploads= multer({storage})
module.exports = uploads