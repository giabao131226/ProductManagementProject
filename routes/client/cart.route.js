const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/cart.controller");
const cartMiddleware = require("../../middlewares/cart.middleware");

router.use(cartMiddleware.cartId);

router.get("/",controller.index)
router.post("/add-cart",controller.addCart);
router.get("/delete-product/:id",controller.deleteProduct);
router.get("/:id/:quantity",controller.changeQuantity);

module.exports = router;
