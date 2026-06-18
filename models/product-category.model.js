const mongoose = require("mongoose");
const slugify = require("slugify");

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
    deletedAt: Date,
    slug: {
        type: String,
        slug: "title",
        unique: true
    }
})

productCategorySchema.pre("save", async function() {
    if (this.isModified("title")) {
        this.slug = slugify(this.title, {
            lower: true,
            strict: true,
            locale: "vi"
        });
    }

});

const productCategory = mongoose.model("productCategory",productCategorySchema,"product-category");
module.exports =  productCategory;