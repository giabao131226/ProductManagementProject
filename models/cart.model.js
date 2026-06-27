const mongoose = require("mongoose");
const cartSchema = mongoose.Schema({
    accountID: mongoose.Schema.Types.ObjectId,
    products: Array
},{
    timestamps: true
})

const Cart = mongoose.model("Cart",cartSchema,"Cart");
module.exports = Cart;