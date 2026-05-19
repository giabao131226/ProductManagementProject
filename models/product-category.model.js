const mongoose = require("mongoose");
const productCategorySchema = mongoose.Schema({
    title: String,
    parent_id: String,
    description: String,
    thumbnail: String,
    status: {
        type: String,
        default: "active"
    },
    position: Number,
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date
})

const productCategory = mongoose.model("productCategory",productCategorySchema,"product-category");

module.exports =  productCategory;