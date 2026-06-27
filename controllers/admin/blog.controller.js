const Blog = require("../../models/blog.model");
// [GET] "/admin/blogs"
module.exports.index = async (req,res) => {
    try{
        const user = res.locals.user;
        const blogs = await Blog.find({
            "deleted": false,
            "status": "active"
        })
        console.log(blogs);
        return res.render("admin/pages/blog/index",{
            user: user,
            blogs: blogs
        })        
    }catch(ex){
        console.log("Lỗi khi hiển thị trang quản lý bài đăng: "+ex);
    }
}

// [GET] "/admin/blogs/create"
module.exports.create = (req,res) => {
    try{
        return res.render("admin/pages/blog/create",{
            "pageTitle": "Tạo mới bài đăng"
        });
    }catch(ex){
        console.log("Lỗi khi hiển thị trang tạo bài đăng: "+ex);
    }
}

// [POST] "/admin/blogs/create"
module.exports.createPost = async (req,res) => {
    try{
        req.body.deleted = false;
        const blog = await Blog.create(req.body);
        req.flash("success","Tạo bài đăng thành công");
        return res.redirect("/admin/blogs");
    }catch(ex){
        console.log("Lỗi khi tạo bài đăng: "+ex);
        req.flash("error","Tạo bài đăng thất bại");
        return res.redirect("/admin/blogs");

    }
}