const mongoose = require("mongoose");
const cartSchema = mongoose.Schema({
    accountID: mongoose.Schema.Types.ObjectId,
    products: Array,
    ticked: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
})

const Cart = mongoose.model("Cart",cartSchema,"Cart");
module.exports = Cart;