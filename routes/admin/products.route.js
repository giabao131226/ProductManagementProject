const express = require("express")
// Multer để upload ảnh
const multer = require('multer')
const storageMulter = require('../../helper/storageMulter')
const upload = multer({storage: storageMulter()});
//
const router = express.Router();

const controller = require("../../controllers/admin/product.controller")

router.get("/",controller.index)
router.patch("/change-status/:status/:id",controller.changeStatus)
router.patch("/change-multi",controller.changeMulti)
router.delete("/delete-product/:id",controller.deleteProduct)
router.get("/trashCan",controller.trashCan)
router.patch("/trash-can/restore-product/:id",controller.restoreProduct)
router.get("/create",controller.create)
router.post("/create",
    upload.single("thumbnail"),
    controller.createPost)
router.get("/edit/:id",controller.editProducts)
router.patch("/edit/:id",upload.single("thumbnail"),controller.editProductPatch)

module.exports = router;