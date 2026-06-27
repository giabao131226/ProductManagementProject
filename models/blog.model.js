const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const blogSchema = mongoose.Schema({
    title: String,
    content: String,
    excerpt: String,
    thumbnail: String,
    deleted: Boolean,
    status: String,
    accountID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account"
    },
    slug: {
        type: String,
        slug: "title",
        unique: true
    }
},{
    timestamps: true
})

const Blog = mongoose.model("Blog",blogSchema,"Blog");
module.exports = Blog;