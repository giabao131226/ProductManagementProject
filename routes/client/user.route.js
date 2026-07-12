const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/user.controller");
const multer = require("multer");
const upload = multer({dest: "uploads/"});
const cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name: "dnlcvjrnb",
    api_key: "345477329557222",
    api_secret: "FY8lP8RMpVvfypM7WcbmXukKbeA"
});


router.get("/register",controller.register);
router.post("/register",controller.registerPost);
router.get("/login",controller.login);
router.post("/login",controller.loginPost);
router.get("/logout",controller.logout);
router.get("/profile",controller.profile);
router.patch("/profile/update",upload.single("avatar"),async (req,res,next) => {
   try{
    if(req.file){
       const result = await cloudinary.uploader.upload(req.file.path);
        req.body.avatar = result.secure_url;
    }
    next();
   }catch(ex){
    console.log("Lỗi khi cập nhật ảnh đại diện "+ex);
   }
},controller.updateProfile);
router.get("/password",controller.password);
router.post("/password",controller.passwordPost);
router.get("/password/otp",controller.typeOtp);
router.post("/password/otp",controller.otpPost);
router.get("/password/change",controller.changePassword);
router.post("/password/change",controller.changePasswordPost);

module.exports = router;