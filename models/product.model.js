const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
    title: String,
    price: Number,
    thumbnail: String,
    active: String,
    delete: Boolean,
})
const Product = mongoose.model('Product',productSchema,"Products");

module.exports = Product