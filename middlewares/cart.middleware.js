const Cart = require("../models/cart.model");

module.exports.cartId = async (req,res,next) => {
    try{
        const cartID = req.cookies.cartID;
        if(!cartID){
            const cart = await Cart.create({});
            res.cookie("cartID",cart._id);
            res.locals.cartID = cart._id;
        }else res.locals.cartID = cartID
        next();
    }catch(ex){
        console.log("Lỗi ở middleware cart: "+ex);
    }
}