const express = require("express");
const controller = require("../../controllers/client/product.controller")
const router = express.Router();

router.get("/", controller.index)
router.get("/detail/:id",controller.detailProduct)

module.exports = router;