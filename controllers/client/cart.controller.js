const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const productHelper = require("../../helper/product");
const mongoose = require("mongoose")

// [GET] "/cart/"
module.exports.index = async (req, res) => {
    try {
        const cartID = res.locals.cartID;
        const cart = await Cart.findOne({ "_id": cartID }).lean();
        let allTick = true;
        cart.products = await Promise.all(cart.products.map(async (item) => {
            const product = await Product.findOne({ "_id": item.productId }).select("_id title price thumbnail").lean();
            product.quantity = item.quantity;
            product.ticked = item.ticked;
            if(!item.ticked) allTick = false;
            return product;
        }));

        const totalPrice = cart.products.reduce((total, item) => {
            return total + (parseInt(item.price.toString()) * parseInt(item.quantity.toString()));
        }, 0)

        return res.render("client/pages/cart/index.pug", {
            cart: cart,
            totalPrice: totalPrice,
            allTick: allTick
        });

    } catch (ex) {
        console.log("Lỗi khi hiển thị giỏ hàng: " + ex);
        return res.redirect("/");
    }
}

// [POST] "cart/add-cart/:productID"
module.exports.addCart = async (req, res) => {
    const backUrl = req.headers.referer || '/';
    try {
        const productId = req.body.productID;
        const quantity = req.body.quantity;
        const cartID = res.locals.cartID;
        const cart = await Cart.findOne({ "_id": cartID });
        const index = cart.products.findIndex((item) => item.productId == productId);

        // Nếu index != -1 thì sẽ tăng số phần tử
        if (index != -1) {
            cart.products[index].quantity = parseInt(cart.products[index].quantity) + parseInt(quantity);
            const result = await Cart.updateOne({ "_id": cartID }, { "products": cart.products });
        } else {
            const result = await Cart.updateOne({ "_id": cartID }, { $push: { products: { "productId": productId, "quantity": parseInt(quantity) } } });
        }
        req.flash("success", "Thêm sản phẩm vào giỏ hàng thành công");
        return res.redirect(backUrl);
    } catch (ex) {
        console.log("Lỗi khi thêm sản phẩm vào giỏ hàng: " + ex);
        req.flash("error", "Thêm sản phẩm vào giỏ hàng thất bại");
        return res.redirect(backUrl);
    }
}

// [GET] "cart/delete-product/:id"
module.exports.deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const cartID = res.locals.cartID;

        const result = await Cart.updateOne({ "_id": cartID }, { $pull: { "products": { productId: id } } });
        req.flash("success", "Xoá sản phẩm khỏi giỏ hàng thành công");
        return res.redirect("/cart");
    } catch (ex) {
        console.log("Lỗi khi xoá sản phẩm khỏi giỏ hàng: " + ex);
        req.flash("error", "Xảy ra lỗi khi xoá sản phẩm khỏi giỏ hàng");
        return res.redirect("/cart");
    }
}

// [GET] "/cart/:id/:quantity"
module.exports.changeQuantity = async (req, res) => {
    try {
        const cartID = req.cookies.cartID;
        const productId = req.params.id;
        const quantity = req.params.quantity;
        if (quantity == 0) {
            const result = await Cart.updateOne({"_id":cartID},{$pull: {
                products: {
                    productId: productId
                }
            }});
        } else {
            const result = await Cart.updateOne(
                { "_id": cartID, "products.productId": productId },
                {
                    $set: {
                        "products.$.quantity": parseInt(quantity)
                    }
                }
            );
        }
        return res.redirect("/cart");
    } catch (ex) {
        console.log("Lỗi khi thay đổi số lượng sản phẩm trong giỏ: " + ex);
    }
}