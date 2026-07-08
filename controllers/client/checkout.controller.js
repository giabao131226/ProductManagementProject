const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");

// [GET] "/checkout"
module.exports.index = async (req,res) => {
    try{
        const cartID = req.cookies.cartID;
        const cart =  await Cart.findOne({"_id": cartID}).lean();
        cart.products = await Promise.all(cart.products.map(async (item) => {
            const product = await Product.findOne({"_id": item.productId}).select("thumbnail title price").lean();
            product.quantity = item.quantity;
            return product;
        }))
        const totalPrice = cart.products.reduce((total, item) => {
            return total + (parseInt(item.price.toString()) * parseInt(item.quantity.toString()));
        }, 0)

        return res.render("client/pages/checkout/index",{
            cart: cart,
            totalPrice: totalPrice
        })
        
    }catch(ex){
        console.log("Lỗi khi hiển thị trang checkout: "+ex);
    }
}

// [POST] "/checkout/order"
module.exports.order = async (req,res) => {
    try{
        const cartID = req.cookies.cartID;
        const userInfo = req.body;
        const cart = await Cart.findOne({"_id": cartID}).lean();
        const products = await Promise.all(cart.products.map(async (item) => {
            const product = await Product.findOne({"_id": item.productId}).select("_id price discountPercentage").lean();
            product.quantity = item.quantity;
            return product;
        }))
        
        const result = await Order.create({
            "cart_id": cartID,
            "userInfo": userInfo,
            "products": products
        });

        return res.redirect(`/checkout/success/${result._id}`);
    }catch(ex){
        console.log("Lỗi khi đặt hàng: "+ex);
        req.flash("error","Đặt hàng không thành công");
        return res.redirect("/checkout");
    }
}

module.exports.checkoutSuccess = async (req,res) => {
    try{
        const orderID = req.params.orderID;
        const order = await Order.findOne({"_id": orderID}).lean();
        let totalPrice = 0;
        order.products = await Promise.all(order.products.map(async (product) => {
            const productInfo = await Product.findOne({"_id": product._id}).select("title thumbnail").lean();
            product.productInfo = productInfo;
            totalPrice += product.price * product.quantity;
            return product;
        }))

        return res.render("client/pages/checkout/success",{
            order: order,
            totalPrice: totalPrice
        })
    }catch(ex){
        console.log("Lỗi khi hiển thị trang đặt hàng thành công: "+ex);
    }
}