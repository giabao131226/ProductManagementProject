const User = require("../../models/user.model");

module.exports.auth = async (req,res,next) => {
    try{
        const tokenUser = req.cookies.tokenUser;
        const user = await User.findOne({
            "deleted": false,
            "status": "active",
            "tokenUser": tokenUser
        });
        if(!user){
            return res.redirect("/user/login");
        }
        res.locals.user = user;
        next();
    }catch(error){
        console.log("Lỗi middle ware khi đăng nhập bên client: "+error);
        return res.redirect("/user/login");
    }
}