const mongoose = require("mongoose");
const slugify = require("slugify");
const productSchema = new mongoose.Schema({
    title: String,
    price: Number,
    thumbnail: String,
    active: String,
    delete: Boolean,
    position: Number,
    categoryID: String,
    featured: Boolean,
    quantity: Number,
    description: String,
    slug: {
        type: String,
        slug: "title",
        unique: true
    }
})

productSchema.pre("save", async function() {
    if (this.isModified("title")) {
        this.slug = slugify(this.title, {
            lower: true,
            strict: true,
            locale: "vi"
        });
    }

});
const Product = mongoose.model('Product',productSchema,"Products");

module.exports = Product