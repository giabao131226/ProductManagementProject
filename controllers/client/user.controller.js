const md5 = require("md5");
const validate = require("../../helper/validate");
const User = require("../../models/user.model");
const sendMail = require("../../helper/sendMail");
const generate = require("../../helper/generate");
const OTP = require("../../models/otp.model");
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
    req.session.oldDataLogin = null;
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
                error: error,
                data: data
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

// [GET] "/user/profile"
module.exports.profile = async (req,res) => {
    const user = res.locals.user;
    res.render("client/pages/user/profile",{
        user: user
    })
}

// [PATCH] "/user/profile/update"
module.exports.updateProfile = async (req,res) =>{
    try{
        const user = res.locals.user;
        const result = await User.updateOne({"_id": user._id},{...req.body});
        req.flash("Success","Cập nhật thông tin tài khoản thành công");
        return res.redirect("/user/profile");
    }catch(ex){
        console.log("Có lỗi khi cập nhật tài khoản người dùng");
        req.flash("error","Có lỗi khi cập nhật thông tin tài khoản người dùng");
        return redirect("/user/profile");
    }
}

// [GET] "/user/password"
module.exports.password = (req,res) => {
    const oldData = req.session.oldData || {};
    const errors = req.session.errors || {};
    delete req.session.oldData;
    delete req.session.errors;
    res.render("client/pages/user/password",{
        "oldData": oldData,
        "errors": errors
    });
}

// [POST] "/user/password"
module.exports.passwordPost = async (req,res) => {
    try{
        const email = req.body.email;
        let errors = {};
        if(!validate.validateEmail(email)){
            errors.errorEmail = "Địa chỉ email không đúng định dạng. Vui lòng kiểm tra lại";
        }
        if(Object.keys(errors).length > 0){
            req.session.oldData = {"email": email};
            req.session.errors = errors;
            return res.redirect("/user/password");
        }
        const existEmail = await User.findOne({"email": email});
        if(!existEmail){
            req.flash("error","Địa chỉ email không tồn tại. Vui lòng kiếm tra lại");
            return res.redirect("/user/password");
        }
        const otp = generate.generateRandomOTP(6);
        await sendMail.sendEmail(email,otp);
        const resultSaveOtpDB = await OTP.create({
            "email": email,
            "otp": otp
        });

        return res.redirect("/user/password/otp");

    }catch(ex){
        console.log("Lỗi khi đổi mật khẩu: "+ex);
        req.flash("error","Tạm thời không thể xử lý, vui lòng thử lại");
        return res.redirect("/user/password");

    }
}

// [GET] "user/password/otp"
module.exports.typeOtp = (req,res) =>{
    res.render("client/pages/user/otp");
}

// [POST] "user/password/otp"
module.exports.otpPost = async (req,res) =>{
    try{
        const otp = req.body.otp;
        const resultQuery = await OTP.findOne({"otp":otp});
        const user = await User.findOne({"email": resultQuery.email});
        res.cookie("tokenUser",user.tokenUser);
        res.redirect("/user/password/change");
    }catch(ex){
        console.log("Lỗi xác minh mã OTP: "+ex);
    }
}

// [GET] "user/password/change"
module.exports.changePassword = (req,res) =>{
    const errors = req.session.error || {};
    const oldData = req.session.oldData || {};
    req.session.error = null;
    req.session.oldData = null;

    res.render("client/pages/user/change-password",{
        "errors": errors,
        "oldData": oldData
    });
}

// [POST] "user/password/change"
module.exports.changePasswordPost = async (req,res)=>{
    try{
        const tokenUser = req.cookies.tokenUser;
        const password = req.body.password;
        const cfPassword = req.body.cfPassword;
        let errors = {};
        if(!validate.validatePassword(password)){
            errors.errorPassword = "Địa chỉ email không đúng định dạng. Vui lòng kiểm tra lại";
        }
        if(password != cfPassword){
            errors.errorCfPassword =  "Xác nhận mật khẩu phải trùng khớp với mật khẩu";
        }
        if(Object.keys(errors).length > 0){
            req.session.error = errors;
            req.session.oldData = {
                "password": password,
                "cfPassword": cfPassword
            }
            return res.redirect("/user/password/change");
        }

        const resultUpdate = await User.updateOne({"tokenUser": tokenUser},{"password": md5(password)});

        req.flash("success","Đổi mật khẩu thành công. Vui lòng đăng nhập cùng mật khẩu mới");
        return res.redirect("/user/login");
    }catch(ex){
        console.log("Lỗi khi thay đổi mật khẩu: "+ex);
    }
}