const User = require("../../models/user.model");
const pagination = require("../../helper/pagination")

// [GET] "/admin/users"
module.exports.index = async (req,res) => {
    try{
         const listButton = [
            {
                content: "Tất cả",
                status: "",
                class: ""
            },
            {
                content: "Hoạt Động",
                status: "active",
                class: ""
            },
            {
                content: "Không Hoạt Động",
                status: "inactive",
                class: ""
            }
        ]

        const find = {
            "deleted": false
        }

        const status = req.query.status || "";
        if(status!="" && status != "all") find.status = status;
        const indexButtonActive = listButton.findIndex((item) => item.status == status);
        if(indexButtonActive != -1) listButton[indexButtonActive].class = "active";

        const keyword = req.query.keyword || "";
        find.email = {
            $regex: keyword,
            $options: "i"
        };

        // Pagination
        let objectPagination = {
            currentPage: 1,
            limitItems: 4
        }
        pagination(req.query, objectPagination, find)
        const countBlog = await User.countDocuments(find);
        const totalPage = Math.ceil(countBlog / objectPagination.limitItems)
        objectPagination.totalPage = totalPage
        //End Pagination

        // Sort
        const keySort = req.query.key || "createdAt"
        const valueSort = req.query.sortValue ? req.query.sortValue : "desc"
        // End Sort

        const users = await User.find(find)
            .sort({[keySort]: valueSort})
            .select("-password")
            .limit(objectPagination.limitItems)
            .skip((objectPagination.currentPage - 1) * 4);


        return res.render("admin/pages/user/index",{
            users: users,
            button: listButton,  
            keyword: keyword,
            currentPage: objectPagination.currentPage,
            totalPage: objectPagination.totalPage, 
        });        
    }catch(ex){
        console.log("Lỗi khi hiển thị trang danh sách người dùng: "+ex);
    }
}

// [PATCH] "/admin/users/change-status/:status/:id"
module.exports.changeStatus = async (req,res) => {
    try{
        const status = req.params.status;
        const id = req.params.id;
        const result = await User.updateOne({"_id": id},{"status": status});
        req.flash("success","Cập nhật trạng thái tài khoản người dùng thành công");
        return res.redirect("/admin/users");
    }catch(ex){
        console.log("Lỗi khi thay đổi trạng thái tài khoản người dùng: "+ex);
        req.flash("error","Có lỗi xảy ra khi thay đổi trạng thái tài khoản người dùng. Vui lòng thử lại");
        return res.redirect("/admin/users");
    }
}