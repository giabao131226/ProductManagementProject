const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    cart_id: String,
    userInfo: {
        fullName: String,
        phone: String,
        address: String
    },
    products: [
        {
            _id:String,
            price: Number,
            discountPercentage: Number,
            quantity: Number
        }
    ],
    deleted: {
        type: Boolean,
        default: false
    }
},{
        timestamps: true
    })

const Order = mongoose.model("Order",orderSchema,"Order");

module.exports = Order;