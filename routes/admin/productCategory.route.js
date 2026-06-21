
const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/productCategory.controller")
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const cloudinary = require("cloudinary");
const fs = require("fs");
const authorization = require("../../middlewares/authorization.middleware");

cloudinary.config({
    cloud_name: "dnlcvjrnb",
    api_key: "345477329557222",
    api_secret: "FY8lP8RMpVvfypM7WcbmXukKbeA"
});

router.get("/",authorization.autho("permissions-category-view"),controller.index)
router.get("/create",authorization.autho("permissions-category-create"),controller.create)
router.post("/create",
    upload.single("thumbnail"),
    async (req, res,next) => {
        try {
            if (req.file) {
                const result = await cloudinary.uploader.upload(req.file.path);
                req.body.thumbnail = result.url;
            }
            next()
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    ,controller.createPost)
router.patch("/delete/:id",authorization.autho("permissions-category-delete"),controller.delete)
router.get("/edit/:id",authorization.autho("permissions-category-edit"),controller.edit)
router.patch("/edit/:id",authorization.autho("permissions-category-edit"),upload.single("thumbnail"),async (req,res,next) => {
    try{
        if(req.file){
            const result = await cloudinary.uploader.upload(req.file.path);
            fs.unlinkSync(req.file.path);
            req.body.thumbnail = result.url;
        }
        next()
    }catch(err){
        res.status(500).json({ error: err.message });

    }
},controller.editPatch);
router.patch("/change-status/:status/:id",authorization.autho("permissions-category-edit"),controller.changeStatus);


module.exports = router;