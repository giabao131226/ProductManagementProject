const express = require("express")
const router = express.Router();

const controller = require("../../controllers/admin/product.controller")

router.get("/",controller.index)
router.patch("/change-status/:status/:id",controller.changeStatus)
router.patch("/change-multi",controller.changeMulti)
router.delete("/delete-product/:id",controller.deleteProduct)
router.get("/trashCan",controller.trashCan)
router.patch("/trash-can/restore-product/:id",controller.restoreProduct)
router.get("/create",controller.create)
router.post("/create",controller.createPost)
module.exports = router;