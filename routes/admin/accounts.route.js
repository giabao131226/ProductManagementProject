const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/accounts.controller");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const cloudinary = require("cloudinary");
const authorization = require("../../middlewares/authorization.middleware");

cloudinary.config({
    cloud_name: "dnlcvjrnb",
    api_key: "345477329557222",
    api_secret: "FY8lP8RMpVvfypM7WcbmXukKbeA"
});

router.get("/",authorization.autho("permissions-account-view"),controller.index);
router.get("/create",authorization.autho("permissions-account-create"),controller.create)
router.post(
    "/create",authorization.autho("permissions-account-create"),
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
router.get("/detail",controller.detail);
router.patch("/detail/:id",upload.single("avatar"),async (req,res,next) => {
    try{
        if(req.file){
            const result = await cloudinary.uploader.upload(req.file.path);
            req.body.avatar = result.url;
        }
        next();
    }catch(error){
        console.log("Lỗi khi cập nhật thông tin tài khoản: "+error);
        return res.redirect("/admin/accounts/detail");
    }
},controller.detailPatch);

module.exports = router;