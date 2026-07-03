const Blog = require("../../models/blog.model");

// [GET] "/blog"
module.exports.index = async (req,res) => {
    try{
        const blogs = await Blog.find({"deleted": false,"status": "active"}).select("thumbnail title createdAt slug excerpt");
        const news = await Blog.find({"deleted": false,"status": "active"}).sort({"createdAt": "desc"}).select("thumbnail title createdAt slug");
        return res.render("client/pages/blog/index",{
            blogs: blogs,
            news: news
        })
    }catch(ex){
        console.log("Lỗi khi hiển thị trang Blog: "+ex);
    }
}

// [GET] "/blog/:slug"
module.exports.detailBlog = async (req,res) => {
    try{
        const slug = req.params.slug;
        const blog = await Blog.findOne({
            "deleted":false,
            "status": "active",
            "slug":slug
        }).populate("accountID");
        return res.render("client/pages/blog/detail",{
            blog: blog
        })
    }catch(ex){
        console.log("Lỗi khi hiển thị trang chi tiết bài đăng: "+ex);
    }
}