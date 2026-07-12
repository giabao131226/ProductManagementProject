const express = require("express");
const route = express.Router();
const controller = require("../../controllers/admin/setting.controller");
const multer = require("multer");
const upload = multer({
    "dest": "uploads/"
});
const cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name: "dnlcvjrnb",
    api_key: "345477329557222",
    api_secret: "FY8lP8RMpVvfypM7WcbmXukKbeA"
});

route.get("/generals", controller.generals);
route.post("/generals", upload.single("logo"), async (req, res, next) => {
    try {
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            console.log(result);
            req.body.logo = result.secure_url;
        }
        next();
    } catch (ex) {
        console.log("Lỗi khi cập nhật ảnh logo trang web: " + ex);
    }
}, controller.generalPost);

module.exports = route;