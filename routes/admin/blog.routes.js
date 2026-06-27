const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/blog.controller");
const multer = require("multer");
const upload = multer({dest: "uploads/"})
const cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name: "dnlcvjrnb",
    api_key: "345477329557222",
    api_secret: "FY8lP8RMpVvfypM7WcbmXukKbeA"
})

router.get("/",controller.index);
router.get("/create",controller.create);
router.post("/create",upload.single("thumbnail"),async (req,res,next) => {
    try{
        if(req.file){
            const result = await cloudinary.uploader.upload(req.file.path);
            req.body.thumbnail = result.secure_url;
        }
        next();
    }catch(ex){
        console.log("Lỗi up ảnh khi tạo bài đăng: "+ex);
        req.flash("error","Lỗi không thể up ảnh")
        return res.redirect("/admin/blogs");
    }
},controller.createPost);

module.exports = router;