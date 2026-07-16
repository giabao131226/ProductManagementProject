

module.exports.autho = (permissions) => {
    return (req,res,next) => {
        const role = res.locals.role
        if(role.permissions.includes(permissions)){
            next();
        }else res.redirect("/admin/dashboard");
    }
}

module.exports.isBanned = (req,res,next) => {
    const user = res.locals.user;
    if(user.status == "banned"){
        return res.redirect("/tai-khoan-bi-cam");
    }
    next();
}