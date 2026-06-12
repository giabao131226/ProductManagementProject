
const mongoose = require("mongoose");
const productLogSchema = mongoose.Schema({
    accountID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Accounts"
    },
    productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
        required: true
    },
    action: String,
    oldData: String,
    newData: String
},{
    timestamps: {
        createdAt: "createAt",
    }
})

const ProductLog = mongoose.model("ProductLog",productLogSchema,"ProductLog");

module.exports = ProductLog;