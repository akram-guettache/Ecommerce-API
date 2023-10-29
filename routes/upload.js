const express = require("express");
const router = express.Router();
const { uploadFile, uploadF } = require("../controllers/upload");
const upload = require("../uploads/fileupload");
router.route("/").post(upload.single("image"), uploadFile).get(uploadF);
module.exports = router;
