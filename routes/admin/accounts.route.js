const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/accounts.controller");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name: "dnlcvjrnb",
    api_key: "345477329557222",
    api_secret: "FY8lP8RMpVvfypM7WcbmXukKbeA"
});

router.get("/",controller.index);
router.get("/create",controller.create)
router.post(
    "/create",
    upload.single("avatar"),
    async (req, res, next) => {
        try {
            console.log(req.file)
            if (req.file) {
                const result = await cloudinary.uploader.upload(req.file.path);
                req.body.avatar = result.url;
            }
            next();
        } catch (error) {
            console.log("Lỗi khi up ảnh avatar: " + error);
            res.status(500).send("Upload failed");
        }
    },
    controller.createPost
);

module.exports = router;