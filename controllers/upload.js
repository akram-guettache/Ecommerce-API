const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
const uploadFile = async (req, res) => {
  const result = await cloudinary.uploader.upload(req.file.path);

  res.json({ message: "File uploaded to Cloudinary successfully!", result });
};

const uploadF = (req, res) => {
  res.status(200).render("upload");
};
module.exports = { uploadFile, uploadF };
