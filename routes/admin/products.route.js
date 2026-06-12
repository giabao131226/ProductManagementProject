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
const authorization = require("../../middlewares/authorization.middleware");

router.get("/",authorization.autho("permissions-product-view") ,controller.index)
router.patch("/change-status/:status/:id", controller.changeStatus)
router.patch("/change-multi", controller.changeMulti)
router.delete("/delete-product/:id", controller.deleteProduct)
router.get("/trashCan", controller.trashCan)
router.patch("/trash-can/restore-product/:id", controller.restoreProduct)
router.get("/create",authorization.autho("permissions-product-create"),controller.create)
router.post("/create",authorization.autho("permissions-product-create"),
    upload.single("thumbnail"),
    async (req, res,next) => {
        try {
            if (req.file) {
                const result = await cloudinary.uploader.upload(req.file.path);
                req.body.thumbnail = result.secure_url
                console.log(result);
            }
            next();
        } catch (err) {
            req.flash("error","Lỗi không thể up ảnh")
            return res.redirect("/admin/products");
        }},
        controller.createPost)
router.get("/edit/:id", authorization.autho("permissions-product-edit"),controller.editProducts)
router.patch("/edit/:id", authorization.autho("permissions-product-edit"),upload.single("thumbnail"), async (req, res,next) => {
    try {
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            req.body.thumbnail = result.url;
        }
        next()
    } catch (err) {
        console.log("Lỗi khi cập nhật sản phẩm: "+err);
        req.flash("error","Không thể cập nhật ảnh vui lòng thử lại");
        return res.redirect(`/admin/products/edit/${req.params.id}`);
    }
}, controller.editProductPatch)
router.get("/detail/:id", authorization.autho("permissions-product-view"),controller.detailProduct)

module.exports = router;