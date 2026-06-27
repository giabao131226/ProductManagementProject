const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/cart.controller");
const cartMiddleware = require("../../middlewares/cart.middleware");

router.post("/add-cart/:productID",cartMiddleware.cartId,controller.addCart);

module.exports = router;