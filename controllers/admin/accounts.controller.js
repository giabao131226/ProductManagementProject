const Accounts = require("../../models/account.model");
const Roles = require("../../models/roles.model");
const validate = require("../../helper/validate");
const md5 = require("md5");
const pagination = require("../../helper/pagination")


// [GET] "/accounts/"
module.exports.index = async (req, res) => {
    try {
        const listButton = [{
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
        if (status != "" && status != "all") find.status = status;
        const indexButtonActive = listButton.findIndex((item) => item.status == status);
        if (indexButtonActive != -1) listButton[indexButtonActive].class = "active";

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
        const countBlog = await Accounts.countDocuments(find);
        const totalPage = Math.ceil(countBlog / objectPagination.limitItems)
        objectPagination.totalPage = totalPage
        //End Pagination

        // Sort
        const keySort = req.query.key || "createdAt"
        const valueSort = req.query.sortValue ? req.query.sortValue : "desc"
        // End Sort

        const accounts = await Accounts.find()
            .sort({[keySort]: valueSort})
            .select("-password")
            .limit(objectPagination.limitItems)
            .skip((objectPagination.currentPage - 1) * 4);
        const lastData = await Promise.all(accounts.map(async (item) => {
            const role = await Roles.findOne({
                "_id": item.role_id
            }).lean();
            return {
                ...item,
                role: role
            }
        }))

        res.render("admin/pages/account/index", {
            accounts: lastData,
            button: listButton,
            keyword: keyword,
            currentPage: objectPagination.currentPage,
            totalPage: objectPagination.totalPage, 
        });
    } catch (error) {
        console.log("Lỗi khi render trang danh sách tài khoản: " + error);
    }
}

// [GET] "/accounts/create"
module.exports.create = async (req, res) => {
    try {
        const find = {
            "deleted": false
        }
        const roles = await Roles.find(find);
        res.render("admin/pages/account/create", {
            roles: roles
        });

    } catch (error) {
        console.log("Lỗi khi render trang thêm tài khoản: " + error);
    }
}

// [POST] "/accounts/create"
module.exports.createPost = async (req, res) => {
    try {
        if (!validate.validateEmail(req.body.email)) {
            req.flash("error", "Email phải đúng định dạng abc@gmail.com");
            return res.redirect("/admin/accounts/create")
        }
        const isTakenEmail = await Accounts.find({
            "email": req.body.email,
            "deleted": false,
        })
        if (isTakenEmail.length > 0) {
            req.flash("error", `Email ${req.body.email} đã tồn tại`);
            return res.redirect("/admin/accounts/create")
        }
        if (!validate.validatePassword(req.body.password)) {
            req.flash("error", "Mật khẩu phải tối thiểu 6 ký tự bao gồm chữ hoa,chữ thường,số và 1 kí tự đặc biệt");
            return res.redirect("/admin/accounts/create")

        }
        if (!validate.validatePhone(req.body.phone)) {
            req.flash("error", "Số điện thoại phải đúng định dạng");
            return res.redirect("/admin/accounts/create");
        }
        const isTakenPhone = await Accounts.find({
            "email": req.body.phone,
            "deleted": false,
        })
        if (isTakenPhone.length > 0) {
            req.flash("error", `Số điện thoại ${req.body.phone} đã tồn tại`);
            return res.redirect("/admin/accounts/create")
        }
        if (req.body.fullName.trim().length == 0) {
            req.flash("error", `Họ tên phải có ít nhất 1 kí tự`);
            return res.redirect("/admin/accounts/create")
        }

        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let token = "";
        for (var i = 0; i < 25; i++) {
            const index = Math.floor(Math.random() * chars.length);
            token += chars[index];
        }
        req.body.token = token;

        req.body.password = md5(req.body.password);
        const result = await Accounts.create(req.body);
        if (result) {
            req.flash("success", "Thêm mới thành công");
            return res.redirect("/admin/accounts");
        }

    } catch (error) {
        console.log("Lỗi khi thêm tài khoản: " + error);
        return res.redirect("/admin/accounts/create")
    }
}

// [GET] "/account/detail"
module.exports.detail = async (req, res) => {
    try {
        const roles = await Roles.find({
            "deleted": false
        })
        return res.render("admin/pages/account/detail.pug", {
            roles: roles
        })

    } catch (error) {
        console.log("Lỗi khi xem thông tin tài khoản: " + error);
    }
}

// [PATCH] "/account/detail/:id"
module.exports.detailPatch = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await Accounts.updateOne({
            "_id": id
        }, {
            ...req.body
        });
        req.flash("success", "Cập Nhật Thông Tin Tài Khoản Thành Công");
        return res.redirect("/admin/accounts/detail");
    } catch (error) {
        console.log("Lỗi khi cập nhật thông tin tài khoản: " + error);
    }
}