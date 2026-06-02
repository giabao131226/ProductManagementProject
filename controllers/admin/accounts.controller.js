const Accounts = require("../../models/account.model");
const Roles = require("../../models/roles.model");
const validate = require("../../helper/validate");
const md5 = require("md5");

// [GET] "/accounts/"
module.exports.index = async (req,res) => {
    try{
        const accounts = await Accounts.find();
        const lastData = await Promise.all(accounts.map(async (item) => {
            const role = await Roles.findOne({"_id": item.role_id}).lean();
            return {
                ...item,role: role
            }
        }))
        console.log(lastData);

        res.render("admin/pages/account/index",{
            accounts: lastData
        });
    }catch(error){
        console.log("Lỗi khi render trang danh sách tài khoản: "+error);
    }
}

// [GET] "/accounts/create"
module.exports.create = async (req,res) => {
    try{
        const find = {
            "deleted": false
        }
        const roles = await Roles.find(find);
        res.render("admin/pages/account/create",{
            roles: roles
        });

    }catch(error){
        console.log("Lỗi khi render trang thêm tài khoản: "+error);
    }
}

// [POST] "/accounts/create"
module.exports.createPost = async (req,res) => {
    try{
        if(!validate.validateEmail(req.body.email)){
            req.flash("error","Email phải đúng định dạng abc@gmail.com");
            return res.redirect("/admin/accounts/create")
        }
        const isTakenEmail = await Accounts.find({
            "email": req.body.email,
            "deleted": false,
        })
        if(isTakenEmail.length > 0){
            req.flash("error",`Email ${req.body.email} đã tồn tại`);
            return res.redirect("/admin/accounts/create")
        }
        if(!validate.validatePassword(req.body.password)){
            req.flash("error","Mật khẩu phải tối thiểu 6 ký tự bao gồm chữ hoa,chữ thường,số và 1 kí tự đặc biệt");
            return res.redirect("/admin/accounts/create")

        }
        if(!validate.validatePhone(req.body.phone)){
            req.flash("error","Số điện thoại phải đúng định dạng");
            return res.redirect("/admin/accounts/create");
        }
        const isTakenPhone = await Accounts.find({
            "email": req.body.phone,
            "deleted": false,
        })
        if(isTakenPhone.length > 0){
            req.flash("error",`Số điện thoại ${req.body.phone} đã tồn tại`);
            return res.redirect("/admin/accounts/create")
        }
        if(req.body.fullName.trim().length == 0){
            req.flash("error",`Họ tên phải có ít nhất 1 kí tự`);
            return res.redirect("/admin/accounts/create")
        }

        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let token = "";
        for(var i=0 ;i<25;i++){
            const index = Math.floor(Math.random() * chars.length );
            token += chars[index];
        }
        req.body.token = token;

        req.body.password = md5(req.body.password);
        const result = await Accounts.create(req.body);
        if(result){
            req.flash("success","Thêm mới thành công");
            return res.redirect("/admin/accounts");
        }

    }catch(error){
        console.log("Lỗi khi thêm tài khoản: "+error);
        return res.redirect("/admin/accounts/create")
    } 
}