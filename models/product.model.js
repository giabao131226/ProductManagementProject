const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
    _id: String,
    title: String,
    price: Number,
    thumbnail: String,
    active: String,
    delete: Boolean,
    position: Number,
})
const Product = mongoose.model('Product',productSchema,"Products");

module.exports = Product