const express = require("express")
// Multer để upload ảnh
const multer = require('multer')
const cloudinary = require('cloudinary')
const streamifier = require('streamifier')

cloudinary.config({
    cloud_name: "dnlcvjrnb",
    api_key: "345477329557222",
    api_secret: "FY8lP8RMpVvfypM7WcbmXukKbeA"
});

// const storageMulter = require('../../helper/storageMulter')
const upload = multer({
    dest: "uploads/"
});//
const router = express.Router();

const controller = require("../../controllers/admin/product.controller")

router.get("/", controller.index)
router.patch("/change-status/:status/:id", controller.changeStatus)
router.patch("/change-multi", controller.changeMulti)
router.delete("/delete-product/:id", controller.deleteProduct)
router.get("/trashCan", controller.trashCan)
router.patch("/trash-can/restore-product/:id", controller.restoreProduct)
router.get("/create", controller.create)
router.post("/create",
    upload.single("thumbnail"),
    async (req, res,next) => {
        try {
            if (req.file) {
                console.log(req.file)
                const result = await cloudinary.uploader.upload(req.file.path);
                console.log(result)
                req.body.thumbnail = result.secure_url
            }
            next()
        } catch (err) {
            res.status(500).json({ error: err.message });
        }},
        controller.createPost)
router.get("/edit/:id", controller.editProducts)
router.patch("/edit/:id", upload.single("thumbnail"), async (req, res) => {
    try {
        if (req.file) {
            console.log(req.file)
            const result = await cloudinary.uploader.upload(req.file.path);
            console.log(result)
            req.body.thumbnail = req.file.path
        }
        next()
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}, controller.editProductPatch)
router.get("/detail/:id", controller.detailProduct)

module.exports = router;