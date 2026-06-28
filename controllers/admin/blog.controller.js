const Blog = require("../../models/blog.model");
const pagination = require("../../helper/pagination")


// [GET] "/admin/blogs"
module.exports.index = async (req,res) => {
    try{
        const query = { "deleted": false}

        const status = req.query.status;
        const keyword = req.query.keyword;
        const key = req.query.key;
        const value = req.query.sortValue;
        if(status && status !="all") query.status = status;
        if(keyword) query.title = {
            $regex: keyword,
            $options: "i"
        }

        const listButton = [
            {
                content: "Tất cả",
                status: "",
                class: (!status || status == "all") ? "active" : ""
            },
            {
                content: "Hoạt Động",
                status: "active",
                class: (status == "active") ? "active" : ""
            },
            {
                content: "Không Hoạt Động",
                status: "inactive",
                class: (status == "inactive") ? "active" : ""
            }
        ]

        // Pagination
        let objectPagination = {
            currentPage: 1,
            limitItems: 4
        }
        pagination(req.query, objectPagination, query)
        const countBlog = await Blog.countDocuments(query);
        const totalPage = Math.ceil(countBlog / objectPagination.limitItems)
        objectPagination.totalPage = totalPage
        //End Pagination

        // Sort
        const keySort = req.query.key || "createdAt"
        const valueSort = req.query.sortValue ? req.query.sortValue : "desc"
        // End Sort

        const user = res.locals.user;
        const blogs = await Blog.find(query)
            .sort({[keySort]: valueSort})
            .limit(objectPagination.limitItems)
            .skip((objectPagination.currentPage - 1) * 4)
        return res.render("admin/pages/blog/index",{
            user: user,
            blogs: blogs,
            buttons: listButton,
            currentPage: objectPagination.currentPage,
            totalPage: objectPagination.totalPage,
            keyAndValueSort: keySort + "-" + valueSort,
            keyword: keyword
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
        const user = res.locals.user;
        req.body.accountID = user._id;
        const blog = await Blog.create(req.body);
        req.flash("success","Tạo bài đăng thành công");
        return res.redirect("/admin/blogs");
    }catch(ex){
        console.log("Lỗi khi tạo bài đăng: "+ex);
        req.flash("error","Tạo bài đăng thất bại");
        return res.redirect("/admin/blogs");
    }
}

// [GET] "/admin/blogs/edit/:id"
module.exports.edit = async (req,res) => {
    try{
        const id = req.params.id;
        const blog = await Blog.findOne({"_id":id});
        return res.render("admin/pages/blog/edit",{
            blog: blog
        })
    }catch(ex){
        console.log("Lỗi khi hiển thị trang chỉnh sửa bài đăng: "+ex);
    }
}

// [PATCH] "/admin/blogs/edit/:id"
module.exports.editPatch = async (req,res) => {
    try{
        const id = req.params.id;
        const blog = await Blog.updateOne({"_id":id},{...req.body});
        req.flash("success","Cập nhật bài đăng thành công");
        return res.redirect("/admin/blogs");
    }catch(ex){
        console.log("Lỗi khi chỉnh sửa bài đăng: "+ex);
        req.flash("error","Chỉnh sửa thất bại. Vui lòng thử lại");
        return res.redirect("/admin");
    }
}

// [DELETE] "/admin/blogs/delete/:id"
module.exports.delete = async (req,res) => {
    try{
        const id = req.params.id;
        const result = await Blog.updateOne({"_id":id},{"deleted": true});
        req.flash("success","Xoá bài đăng thành công");
        return res.redirect("/admin/blogs");
    }catch(ex){
        console.log("Lỗi khi xoá bài đăng: "+ex);
        req.flash("error","Không thể xoá bài đăng. Vui lòng thử lại");
        return res.redirect("/admin/blogs");
    }
}

// [GET] "/admin/blogs/detail/:id"
module.exports.detail = async (req,res) => {
    try{
        const id = req.params.id;
        const blog = await Blog.findOne({
            "deleted":false,
            "status": "active",
            "_id":id
        }).populate("accountID");
        return res.render("admin/pages/blog/detail",{
            blog: blog
        })
    }catch(ex){
        console.log("Lỗi khi xem chi tiết bài đăng: "+ex);
        
    }
}
// [PATCH] "/admin/blogs/change-status/:status/:id"
module.exports.changeStatus = async (req,res) => {
    try{
        const id = req.params.id;
        const status = req.params.status;
        console.log(id,status);
        const result = await Blog.updateOne({"_id":id},{"status": status});
        req.flash("success","Cập nhật trạng thái bài đăng thành công");
        return res.redirect("/admin/blog");
    }catch(ex){
        console.log("Lỗi khi thay đổi trạng thái bài đăng: "+ex);
        req.flash("error","Không thể cập nhật trạng thái bài đăng. Vui lòng thử lại");
        return res.redirect("/admin/blog");
    }
}
