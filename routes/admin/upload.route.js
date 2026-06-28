const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({"dest": "uploads/"})
const cloundinary = require("cloudinary");
cloundinary.config({
    cloud_name: "dnlcvjrnb",
    api_key: "345477329557222",
    api_secret: "FY8lP8RMpVvfypM7WcbmXukKbeA"
})

router.post("/",upload.single("file"),async (req,res) => {
    try{
        if(req.file){
            const result = await cloundinary.uploader.upload(req.file.path);
            return res.json({location: result.secure_url});
        }
        return null;
    }catch(ex){
        console.log("Lỗi khi upload ảnh: "+ex);
    }
})

module.exports = router;