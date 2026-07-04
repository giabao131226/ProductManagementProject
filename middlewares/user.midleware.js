const User = require("../models/user.model");

module.exports.userInfo = async (req,res,next) => {
    const tokenUser = req.cookies.tokenUser;
    const user = await User.findOne({"tokenUser": tokenUser}).select("-password").lean();
    res.locals.user = user;
    next();
}