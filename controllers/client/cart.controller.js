const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const productHelper = require("../../helper/product");
const mongoose = require("mongoose")

// [GET] "/cart/"
module.exports.index = async (req,res) => {
    try{
        const cartID = res.locals.cartID;
        const cart = await Cart.findOne({"_id": cartID}).lean();

        cart.products = await Promise.all(cart.products.map(async (item) => {
            const product = await Product.findOne({"_id": item.productId}).select("_id title price thumbnail").lean();
            product.quantity = item.quantity;
            return product;
        }));

        return res.render("client/pages/cart/index.pug",{
            cart: cart
        });
        
    }catch(ex){
        console.log("Lỗi khi hiển thị giỏ hàng: "+ex);
        return res.redirect("/");
    }
}

// [POST] "/add-cart/:productID"
module.exports.addCart = async (req,res) => {
    const backUrl = req.headers.referer || '/';
    try{
        const productId = req.body.productID;
        const quantity = req.body.quantity;
        const cartID = res.locals.cartID;
        const cart = await Cart.findOne({"_id":cartID});
        const index = cart.products.findIndex((item) => item.productId==productId);

        // Nếu index != -1 thì sẽ tăng số phần tử
        if(index != -1){
            cart.products[index].quantity = parseInt(cart.products[index].quantity) + parseInt(quantity);
            const result = await Cart.updateOne({"_id":cartID},{"products": cart.products});
        }else{
            const result = await Cart.updateOne({"_id":cartID},{$push: {products: {"productId": productId,"quantity": parseInt(quantity)}}});
        }
        req.flash("success","Thêm sản phẩm vào giỏ hàng thành công");
        return res.redirect(backUrl);
    }catch(ex){
        console.log("Lỗi khi thêm sản phẩm vào giỏ hàng: "+ex);
        req.flash("error","Thêm sản phẩm vào giỏ hàng thất bại");
        return res.redirect(backUrl);
    }
}