const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/chat.controller");
const authen = require("../../middlewares/authentication.middlewares");
const chatMiddleware = require("../../middlewares/client/chat.middleware");
const cloudinary = require("cloudinary");
const multer = require("multer");
const upload = multer({"dest": "uploads/"});


cloudinary.config({
    cloud_name: "dnlcvjrnb",
    api_key: "345477329557222",
    api_secret: "FY8lP8RMpVvfypM7WcbmXukKbeA"
});


router.get("/",controller.index);
router.post("/create-room",upload.single('avatar'),async (req,res,next) => {
    try{
        if(req.file){
            const result = await cloudinary.uploader.upload(req.file.path);
            console.log(result);
            req.body.avatar = result.secure_url;
        }
        next();
    }catch(ex){
        console.log("Lỗi up ảnh chat.route(create-room): "+ex);
    }
},controller.createRoom);
router.get("/:roomChatID",chatMiddleware.check,controller.chat);

module.exports = router;