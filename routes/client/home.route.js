const express = require("express");
const controller = require("../../controllers/client/home.controller")
const router = express.Router();

router.get("/",controller.index);
router.get("/search",controller.search);
router.get("/chi-tiet-san-pham/:slugProduct",controller.detailProduct);

module.exports = router;