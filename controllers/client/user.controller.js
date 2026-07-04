const md5 = require("md5");
const validate = require("../../helper/validate");
const User = require("../../models/user.model");
// [GET] "/user/register"
module.exports.register = (req,res) => {
    const oldData = req.session.oldDataRegister || {};
    req.session.oldDataRegister = null;
    return res.render("client/pages/user/register",{
        oldData: oldData
    });
}

// [POST] "/user/register"
module.exports.registerPost = async (req,res) => {
    try{
        const data = req.body;
        const email = data.email;
        const existEmail = await User.findOne({"email": email});
        if(existEmail){
            req.flash("error","Địa chỉ email đã tồn tại. Vui lòng lựa chọn địa chỉ email khác");
            return res.redirect("/user/register");
        }
        let error = {};
        if(!validate.validateEmail(email)){
            console.log(email);
            error.errorEmail = "Địa chỉ email không đúng định dạng. Vui lòng kiểm tra lại";
        }
        if(!validate.validatePassword(data.password)){
            error.errorPassword =  "Mật khẩu không đúng định dạng. Vui lòng kiểm tra lại";
        }
        if(data.password != data.cfPassword){
            error.errorCfPassword =  "Xác nhận mật khẩu phải trùng khớp với mật khẩu";
        }
        if(Object.keys(error).length > 0){
            res.session.oldDataRegister = {
                dataInput: data,
                error: error
            }
            return res.redirect("/user/register");
        }
        const result = User.create({
            email: email,
            password: md5(data.password)
        })
        req.flash("success","Đăng ký tài khoản thành công");
        return res.redirect("/");
    }catch(ex){
        console.log("Lỗi khi đăng ký tài khoản: "+ex);
    }
}

// [GET] "/user/login"
module.exports.login = (req,res) =>{
    const oldData = req.session.oldDataLogin || {};
    return res.render("client/pages/user/login",{
        oldData: oldData
    });
}

// [POST] "/user/loginPost"
module.exports.loginPost = async (req,res) => {
    try{
        const data = req.body;
        let error = {};
        if(!validate.validateEmail(data.email)){
            error.errorEmail = "Địa chỉ email không đúng định dạng. Vui lòng kiểm tra lại";
        }
        if(!validate.validatePassword(data.password)){
            error.errorPassword = "Mật khẩu không đúng định dạng. Vui lòng kiểm tra lại";
        }
        if(Object.keys(error).length > 0){
            req.session.oldDataLogin = {
                error: error
            }
            return res.redirect("/user/login");
        }
        const user = await User.findOne({"email": data.email,"password": md5(data.password)});
        if(!user){
            req.flash("error","Địa chỉ email hoặc mật khẩu không chính xác. Vui lòng kiếm tra lại");
            return res.redirect("/user/login");
        }
        res.cookie("tokenUser",user.tokenUser);
        return res.redirect("/");
    }catch(ex){
        console.log("Lỗi khi đăng nhập: "+ex);
    }
}

// [GET] "/user/logout"
module.exports.logout = (req,res) => {
    res.clearCookie("tokenUser");
    return res.redirect("/");
}