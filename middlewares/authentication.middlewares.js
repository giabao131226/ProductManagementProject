const Accounts = require("../models/account.model");
const Roles = require("../models/roles.model");

module.exports.auth = async (req,res,next) => {
    try{
        const token = req.cookies.token;
        const account = await Accounts.findOne({
            "deleted": false,
            "status": "active",
            "token": token
        });
        if(!account){
            return res.redirect("/admin/auth");
        }
        const role = await Roles.findOne({"_id": account.role_id});
        res.locals.role = role;
        res.locals.user = account;
        next();
    }catch(error){
        console.log("Lỗi middle ware khi đăng nhập: "+error);
        return res.redirect("/admin/auth");
    }
}