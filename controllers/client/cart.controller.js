const Cart = require("../../models/cart.model");
// [POST] "/add-cart/:productID"
module.exports.addCart = async (req,res) => {
    try{
        const productId = req.params.productID;
        const cartID = res.locals.cartID;

        const cart = await Cart.findOne({"_id": cartID});
        console.log(cart);
        
    }catch(ex){
        console.log("Lỗi khi thêm sản phẩm vào giỏ hàng: "+ex);
    }
}