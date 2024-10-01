const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary:cloudinary,
  params: {
    folder: 'wanderlust_DEV',
   allowedFormats : ["png","jpg","jpeg"],
//    public_id: (req,file) => "computer-filename-using-request", // supports promises as well
  },
});

module.exports = {
  cloudinary,
  storage,
}