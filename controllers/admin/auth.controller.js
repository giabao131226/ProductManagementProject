const Accounts = require("../../models/account.model");
const md5 = require("md5");

// [GET] "/auth"
module.exports.index = (req,res) => {
    res.render("admin/pages/auth/auth");
}

// [POST] "/auth"
module.exports.signIn = async (req,res) => {
    try{
        const user = await Accounts.findOne({
            "deleted": false,
            "email": req.body.email
        })
        if(user){
            if(user.password == md5(req.body.password)){
                res.cookie("token",user.token);
                req.flash("success","Đăng nhập thành công");
                return res.redirect("/admin/dashboard");
            }else{
                req.flash("error","Đăng nhập không thành công. Mật khẩu không chính xác")
                return res.redirect("/admin/auth");
            }
        }else{
            req.flash("error","Đăng nhập không thành công. Email không chính xác")
            return res.redirect("/admin/auth");
        }
    }catch(error){
        console.log("Lỗi khi đăng nhập: "+error);
        req.flash("error","Đăng nhập không thành công. Có lỗi trong cơ sở dữ liệu");
        return res.redirect("/admin/auth");
    }
}